import { LoanRejectedEvent } from '../events';
import type { LoanProposalState } from '../aggregate';

export const onLoanRejected = (
  state: LoanProposalState,
  event: LoanRejectedEvent
): LoanProposalState => {
  if (state === null) return null; // Defensive check
  return {
    ...state,
    status: 'REJECTED',
    version: event.version
  };
};
