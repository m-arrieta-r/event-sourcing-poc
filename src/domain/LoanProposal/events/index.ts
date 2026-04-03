import { LoanRequestedEvent } from './LoanRequested';
import { LoanApprovedEvent } from './LoanApproved';
import { LoanRejectedEvent } from './LoanRejected';

export * from './LoanRequested';
export * from './LoanApproved';
export * from './LoanRejected';

export type LoanProposalEvent = LoanRequestedEvent | LoanApprovedEvent | LoanRejectedEvent;
