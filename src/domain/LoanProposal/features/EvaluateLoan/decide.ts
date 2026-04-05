import { Result, success, failure } from '../../../../shared/result';
import { Command } from './command';
import { LoanProposalEvent, LoanApprovedEvent, LoanRejectedEvent } from '../../events';
import { LoanProposalState } from '../../aggregate';
import { isIncomeSufficient } from '../../internal/isIncomeSufficient';

export const decide = (
  _command: Command,
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
      payload: {}
    };
    return success([approvedEvent]);
  } else {
    const rejectedEvent: LoanRejectedEvent = {
      name: 'LoanRejected',
      aggregateId: state.id,
      version: state.version + 1,
      timestamp: new Date(),
      payload: {}
    };
    return success([rejectedEvent]);
  }
};
