import { EventStore } from '../shared/EventStore';
import { Result, success, failure } from '../shared/result';
import { DomainEvent } from '../shared/message';
import { LoanProposalEvent } from '../domain/LoanProposal/events';
import { LoanProposalState, apply } from '../domain/LoanProposal/aggregate';
import { LoanProposalRepository } from '../domain/LoanProposal/repository';

const KNOWN_EVENT_NAMES = new Set<string>(['LoanRequested', 'LoanApproved', 'LoanRejected']);

/**
 * Validates that a raw DomainEvent from the store is a known LoanProposalEvent.
 * Throws if the event name is unrecognised, preventing silent deserialization corruption.
 */
const deserializeLoanProposalEvent = (raw: DomainEvent<any, any>): LoanProposalEvent => {
  if (!KNOWN_EVENT_NAMES.has(raw.name)) {
    throw new Error(`Unknown LoanProposal event type encountered in store: "${raw.name}"`);
  }
  return raw as LoanProposalEvent;
};

/**
 * Factory that wires the LoanProposal aggregate to a concrete EventStore.
 * Lives in infra because it depends on the EventStore abstraction as a driver.
 */
export const createLoanProposalRepository = (eventStore: EventStore): LoanProposalRepository => {

  const load = async (id: string): Promise<LoanProposalState> => {
    const rawEvents = await eventStore.loadEvents(id);
    const events = rawEvents.map(deserializeLoanProposalEvent);
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
    const state = id ? await load(id) : null;
    const result = process(state);

    if (result.isSuccess) {
      const events = result.value;
      if (events.length > 0) {
        const aggregateId = id || events[0].aggregateId;
        await eventStore.append(aggregateId, events);
      }
      return success(undefined);
    }

    return failure(result.error);
  };

  return { load, loadAll, execute };
};
