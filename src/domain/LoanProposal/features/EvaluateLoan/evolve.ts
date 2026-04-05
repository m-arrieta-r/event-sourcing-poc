import { LoanApprovedEvent, LoanRejectedEvent } from '../../events';
import type { LoanProposalState } from '../../aggregate';

export const evolvers = {
  LoanApproved: (
    state: LoanProposalState,
    event: LoanApprovedEvent
  ): LoanProposalState => {
    if (state === null) return null; // Defensive check
    return {
      ...state,
      status: 'APPROVED',
      version: event.version
    };
  },
  LoanRejected: (
    state: LoanProposalState,
    event: LoanRejectedEvent
  ): LoanProposalState => {
    if (state === null) return null; // Defensive check
    return {
      ...state,
      status: 'REJECTED',
      version: event.version
    };
  }
};
