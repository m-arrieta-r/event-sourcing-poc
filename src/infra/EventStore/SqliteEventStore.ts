import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { EventStore } from '../../shared/EventStore';
import { DomainEvent } from '../../shared/message';

export class SqliteEventStore implements EventStore {
  private db: Database<sqlite3.Database, sqlite3.Statement> | null = null;
  private readonly dbFilePath: string;

  constructor(dbFilePath: string = './events.db') {
    this.dbFilePath = dbFilePath;
  }

  async init(): Promise<void> {
    this.db = await open({
      filename: this.dbFilePath,
      driver: sqlite3.Database
    });

    // We use a composite primary key to guarantee optimistic concurrency.
    // If two requests try to append the same version for an aggregate, one will fail.
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS journal (
        aggregate_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        name TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        payload TEXT NOT NULL,
        PRIMARY KEY (aggregate_id, version)
      );
    `);
  }

  async append(aggregateId: string, events: DomainEvent<any, any>[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');
    if (events.length === 0) return;
    
    await this.db.exec('BEGIN TRANSACTION');
    try {
      const stmt = await this.db.prepare(
        'INSERT INTO journal (aggregate_id, version, name, timestamp, payload) VALUES (?, ?, ?, ?, ?)'
      );
      
      for (const event of events) {
        await stmt.run(
          aggregateId,
          event.version,
          event.name,
          event.timestamp.toISOString(),
          JSON.stringify(event.payload)
        );
      }
      await stmt.finalize();
      await this.db.exec('COMMIT');
    } catch (error) {
      await this.db.exec('ROLLBACK');
      throw error;
    }
  }

  async loadEvents(aggregateId: string): Promise<DomainEvent<any, any>[]> {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');

    const rows = await this.db.all(
      'SELECT * FROM journal WHERE aggregate_id = ? ORDER BY version ASC',
      aggregateId
    );

    return rows.map(row => ({
      name: row.name,
      aggregateId: row.aggregate_id,
      version: row.version,
      timestamp: new Date(row.timestamp),
      payload: JSON.parse(row.payload)
    }));
  }
}
