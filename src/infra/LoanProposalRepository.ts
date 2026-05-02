import { EventStore } from '../shared/EventStore';
import { Result, success, failure } from '../shared/result';
import { DomainEvent } from '../shared/message';
import { VersionConflictError } from '../shared/errors';
import { LoanProposalEvent } from '../domain/LoanProposal/events';
import { LoanProposalState, apply } from '../domain/LoanProposal/aggregate';
import { LoanProposalRepository, CommandMetadata } from '../domain/LoanProposal/repository';

const assertString = (value: unknown, field: string): void => {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid payload: "${field}" must be a non-empty string`);
  }
};

const assertNumber = (value: unknown, field: string): void => {
  if (typeof value !== 'number' || !isFinite(value)) {
    throw new Error(`Invalid payload: "${field}" must be a finite number`);
  }
};

const validatePayload: Record<string, (payload: any) => void> = {
  LoanRequested: (p) => {
    assertString(p?.customer?.id, 'customer.id');
    assertString(p?.customer?.name, 'customer.name');
    assertString(p?.customer?.cpf, 'customer.cpf');
    assertNumber(p?.customer?.monthlyIncome, 'customer.monthlyIncome');
    assertNumber(p?.requestedAmount, 'requestedAmount');
    assertNumber(p?.installments, 'installments');
  },
  LoanApproved: (_p) => {},
  LoanRejected: (_p) => {},
};

const deserializeLoanProposalEvent = (raw: DomainEvent<any, any>): LoanProposalEvent => {
  const validator = validatePayload[raw.name];
  if (!validator) {
    throw new Error(`Unknown LoanProposal event type encountered in store: "${raw.name}"`);
  }
  validator(raw.payload);
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
    process: (state: LoanProposalState) => Result<LoanProposalEvent[], string>,
    metadata?: CommandMetadata
  ): Promise<Result<void, string>> => {
    const state = id ? await load(id) : null;
    const result = process(state);

    if (result.isSuccess) {
      const events = result.value;
      if (events.length > 0) {
        const aggregateId = id || events[0].aggregateId;
        const stamped = events.map(e => ({
          ...e,
          ...(metadata?.correlationId != null && { correlationId: metadata.correlationId }),
          ...(metadata?.causationId != null && { causationId: metadata.causationId }),
        }));
        try {
          await eventStore.append(aggregateId, stamped);
        } catch (error) {
          if (error instanceof VersionConflictError) {
            return failure('version_conflict');
          }
          throw error;
        }
      }
      return success(undefined);
    }

    return failure(result.error);
  };

  return { load, loadAll, execute };
};
