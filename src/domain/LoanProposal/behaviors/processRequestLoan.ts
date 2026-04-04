import { Result, success, failure } from '../../../shared/result';
import { RequestLoanCommand } from '../commands';
import { LoanProposalEvent, LoanRequestedEvent } from '../events';
import { LoanProposalState } from '../aggregate';
import { isAmountValid } from '../internal/isAmountValid';

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
