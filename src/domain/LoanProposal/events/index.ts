import { LoanRequestedEvent } from './LoanRequested';
import { LoanApprovedEvent } from './LoanApproved';
import { LoanRejectedEvent } from './LoanRejected';
import { LoanCancelledEvent } from './LoanCancelled';

export * from './LoanRequested';
export * from './LoanApproved';
export * from './LoanRejected';
export * from './LoanCancelled';

export type LoanProposalEvent = LoanRequestedEvent | LoanApprovedEvent | LoanRejectedEvent | LoanCancelledEvent;
