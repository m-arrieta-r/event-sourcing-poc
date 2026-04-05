import type { LoanProposalState } from '../aggregate';
import type { LoanProposalEvent } from '../events';
import { onLoanRequested } from './onLoanRequested';
import { onLoanApproved } from './onLoanApproved';
import { onLoanRejected } from './onLoanRejected';

// Keyed on LoanProposalEvent['name']: TS will error if a new event is added without a reducer.
export const reducers: Record<
  LoanProposalEvent['name'],
  (state: LoanProposalState, event: any) => LoanProposalState
> = {
  LoanRequested: onLoanRequested,
  LoanApproved: onLoanApproved,
  LoanRejected: onLoanRejected,
};
