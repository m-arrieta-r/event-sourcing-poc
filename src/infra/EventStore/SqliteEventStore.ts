import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { EventStore } from '../../shared/EventStore';
import { DomainEvent } from '../../shared/message';
import { VersionConflictError } from '../../shared/errors';

export const createSqliteEventStore = async (dbFilePath: string = './events.db'): Promise<EventStore> => {
  const db = await open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });

  // Composite PK (aggregate_id, version) gives us optimistic concurrency for free.
  // Two concurrent appends for the same version will cause a unique constraint violation.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS journal (
      aggregate_id   TEXT NOT NULL,
      version        INTEGER NOT NULL,
      name           TEXT NOT NULL,
      timestamp      TEXT NOT NULL,
      payload        TEXT NOT NULL,
      correlation_id TEXT,
      causation_id   TEXT,
      PRIMARY KEY (aggregate_id, version)
    );
  `);

  const append = async (aggregateId: string, events: DomainEvent<any, any>[]): Promise<void> => {
    if (events.length === 0) return;

    await db.exec('BEGIN TRANSACTION');
    try {
      const stmt = await db.prepare(
        'INSERT INTO journal (aggregate_id, version, name, timestamp, payload, correlation_id, causation_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      for (const event of events) {
        await stmt.run(
          aggregateId,
          event.version,
          event.name,
          event.timestamp.toISOString(),
          JSON.stringify(event.payload),
          event.correlationId ?? null,
          event.causationId ?? null,
        );
      }
      await stmt.finalize();
      await db.exec('COMMIT');
    } catch (error) {
      await db.exec('ROLLBACK');
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        throw new VersionConflictError(aggregateId);
      }
      throw error;
    }
  };

  const loadEvents = async (aggregateId: string): Promise<DomainEvent<any, any>[]> => {
    const rows = await db.all(
      'SELECT * FROM journal WHERE aggregate_id = ? ORDER BY version ASC',
      aggregateId
    );
    return rows.map(row => ({
      name: row.name,
      aggregateId: row.aggregate_id,
      version: row.version,
      timestamp: new Date(row.timestamp),
      payload: JSON.parse(row.payload),
      ...(row.correlation_id != null && { correlationId: row.correlation_id }),
      ...(row.causation_id != null && { causationId: row.causation_id }),
    }));
  };

  const getAllAggregateIds = async (): Promise<string[]> => {
    const rows = await db.all('SELECT DISTINCT aggregate_id FROM journal');
    return rows.map(row => row.aggregate_id);
  };

  return { append, loadEvents, getAllAggregateIds };
};
