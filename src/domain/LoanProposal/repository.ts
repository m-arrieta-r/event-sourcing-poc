import { EventStore } from '../../shared/EventStore';
import { Result, success, failure } from '../../shared/result';
import { LoanProposalEvent } from './events';
import { LoanProposalState, apply } from './aggregate';

export type LoanProposalRepository = {
  load: (id: string) => Promise<LoanProposalState>;
  loadAll: () => Promise<LoanProposalState[]>;
  execute: (
    id: string | null,
    process: (state: LoanProposalState) => Result<LoanProposalEvent[], string>
  ) => Promise<Result<void, string>>;
};

export const createLoanProposalRepository = (eventStore: EventStore): LoanProposalRepository => {
  
  const load = async (id: string): Promise<LoanProposalState> => {
    // We cast it to LoanProposalEvent[] since EventStore is generic/DomainEvent<any, any>
    const events = (await eventStore.loadEvents(id)) as LoanProposalEvent[];
    if (events.length === 0) return null;
    return events.reduce(apply, null);
  };

  const loadAll = async (): Promise<LoanProposalState[]> => {
    const ids = await eventStore.getAllAggregateIds();
    const proposals = await Promise.all(ids.map(id => load(id)));
    return proposals.filter((p): p is NonNullable<typeof p> => p !== null);
  };

  const execute = async (
    id: string | null,
    process: (state: LoanProposalState) => Result<LoanProposalEvent[], string>
  ): Promise<Result<void, string>> => {
    // 1. Load state if an ID was provided
    const state = id ? await load(id) : null;
    
    // 2. Execute process logic to compute new events
    const result = process(state);
    
    if (result.isSuccess) {
      const events = result.value;
      if (events.length > 0) {
        // 3. Append to EventStore
        const aggregateId = id || events[0].aggregateId;
        await eventStore.append(aggregateId, events);
      }
      return success(undefined);
    }
    
    // Return failure logic
    return failure(result.error);
  };

  return { load, loadAll, execute };
};
