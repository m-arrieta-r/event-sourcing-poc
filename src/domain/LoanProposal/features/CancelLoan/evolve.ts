import { LoanCancelledEvent } from '../../events';
import type { LoanProposalState } from '../../aggregate';

export const evolvers = {
  LoanCancelled: (
    state: LoanProposalState,
    event: LoanCancelledEvent
  ): LoanProposalState => {
    if (state === null) return null;
    return {
      ...state,
      status: 'CANCELLED',
      version: event.version
    };
  }
};
