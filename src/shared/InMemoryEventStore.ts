import { EventStore } from './EventStore';
import { DomainEvent } from './message';

/**
 * Creates an in-memory instance of EventStore using a closure to encapsulate state.
 * Strictly avoids classes to adhere to functional programming rules.
 */
export const createInMemoryEventStore = (): EventStore => {
  const eventsStore: Record<string, DomainEvent<any, any>[]> = {};

  return {
    append: async (aggregateId: string, newEvents: DomainEvent<any, any>[]): Promise<void> => {
      const currentEvents = eventsStore[aggregateId] || [];
      eventsStore[aggregateId] = [...currentEvents, ...newEvents];
    },
    
    loadEvents: async (aggregateId: string): Promise<DomainEvent<any, any>[]> => {
      // Returns a shallow copy to prevent external mutation of the internal store array
      return [...(eventsStore[aggregateId] || [])];
    },

    getAllAggregateIds: async (): Promise<string[]> => {
      return Object.keys(eventsStore);
    }
  };
};
