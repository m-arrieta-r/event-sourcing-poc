import { LoanApprovedEvent } from '../events';
import type { LoanProposalState } from '../aggregate';

export const onLoanApproved = (
  state: LoanProposalState,
  event: LoanApprovedEvent
): LoanProposalState => {
  if (state === null) return null; // Defensive check
  return {
    ...state,
    status: event.payload.status,
    version: event.version
  };
};
