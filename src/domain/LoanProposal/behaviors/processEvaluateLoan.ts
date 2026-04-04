import { Result, success, failure } from '../../../shared/result';
import { EvaluateLoanCommand } from '../commands';
import { LoanProposalEvent, LoanApprovedEvent, LoanRejectedEvent } from '../events';
import { LoanProposalState } from '../aggregate';
import { isIncomeSufficient } from '../internal/isIncomeSufficient';

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
