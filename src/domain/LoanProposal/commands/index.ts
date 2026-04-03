import { RequestLoanCommand } from './RequestLoan';
import { EvaluateLoanCommand } from './EvaluateLoan';

export * from './RequestLoan';
export * from './EvaluateLoan';

export type LoanProposalCommand = RequestLoanCommand | EvaluateLoanCommand;
