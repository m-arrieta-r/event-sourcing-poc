import { LoanRequestedEvent } from '../../events';
import type { LoanProposalState } from '../../aggregate';

export const evolvers = {
  LoanRequested: (
    state: LoanProposalState,
    event: LoanRequestedEvent
  ): LoanProposalState => {
    return {
      id: event.aggregateId,
      customer: event.payload.customer,
      requestedAmount: event.payload.requestedAmount,
      installments: event.payload.installments,
      status: 'PENDING',
      createdAt: event.timestamp,
      version: event.version,
    };
  }
};
