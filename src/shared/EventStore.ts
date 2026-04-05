import { DomainEvent } from './message';

export type EventStore = {
  append: (aggregateId: string, events: DomainEvent<any, any>[]) => Promise<void>;
  loadEvents: (aggregateId: string) => Promise<DomainEvent<any, any>[]>;
  getAllAggregateIds: () => Promise<string[]>;
};
