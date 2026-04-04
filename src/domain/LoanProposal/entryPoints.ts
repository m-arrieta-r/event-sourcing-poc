import { Result, success, failure } from '../../shared/result';
import { RequestLoanCommand, EvaluateLoanCommand } from './commands';
import { LoanProposalEvent, LoanRequestedEvent, LoanApprovedEvent, LoanRejectedEvent } from './events';
import { LoanProposalState } from './aggregate';
import { isAmountValid } from './internal/isAmountValid';
import { isIncomeSufficient } from './internal/isIncomeSufficient';

/**
 * processRequestLoan takes the RequestLoan command and current state,
 * runs specific business rules, and returns Domain Events.
 */
export const processRequestLoan = (
  command: RequestLoanCommand,
  state: LoanProposalState
): Result<LoanProposalEvent[], string> => {
  if (state !== null) {
    return failure('Loan Proposal already exists');
  }
  if (!isAmountValid(command.payload.requestedAmount)) {
    return failure('Requested amount is out of allowed range.');
  }
  
  const event: LoanRequestedEvent = {
    name: 'LoanRequested',
    aggregateId: `loan-${Date.now()}`, // Temporary ID generation
    version: 1,
    timestamp: new Date(),
    payload: {
      customer: command.payload.customer,
      requestedAmount: command.payload.requestedAmount,
      installments: command.payload.installments,
      status: 'PENDING'
    }
  };
  return success([event]);
};

/**
 * processEvaluateLoan calculates facts for a requested EvaluateLoan command.
 */
export const processEvaluateLoan = (
  command: EvaluateLoanCommand,
  state: LoanProposalState
): Result<LoanProposalEvent[], string> => {
  if (state === null) {
    return failure('Loan Proposal does not exist');
  }
  if (state.status !== 'PENDING') {
    return failure('Loan Proposal is not in PENDING status');
  }
  
  const isSufficient = isIncomeSufficient(
    state.customer.monthlyIncome,
    state.requestedAmount,
    state.installments
  );

  if (isSufficient) {
    const approvedEvent: LoanApprovedEvent = {
      name: 'LoanApproved',
      aggregateId: state.id,
      version: state.version + 1,
      timestamp: new Date(),
      payload: { status: 'APPROVED' }
    };
    return success([approvedEvent]);
  } else {
    const rejectedEvent: LoanRejectedEvent = {
      name: 'LoanRejected',
      aggregateId: state.id,
      version: state.version + 1,
      timestamp: new Date(),
      payload: { status: 'REJECTED' }
    };
    return success([rejectedEvent]);
  }
};
