import type { LoanProposalState } from '../aggregate';
import { onLoanRequested } from './onLoanRequested';
import { onLoanApproved } from './onLoanApproved';
import { onLoanRejected } from './onLoanRejected';

export const reducers: Record<string, (state: LoanProposalState, event: any) => LoanProposalState> = {
  LoanRequested: onLoanRequested,
  LoanApproved: onLoanApproved,
  LoanRejected: onLoanRejected,
};
