import { Result, success, failure } from '../../../../shared/result';
import { Command } from './command';
import { LoanProposalEvent, LoanCancelledEvent } from '../../events';
import { LoanProposalState } from '../../aggregate';

export const decide = (
  command: Command,
  state: LoanProposalState
): Result<LoanProposalEvent[], string> => {
  if (state === null) {
    return failure('Loan Proposal does not exist');
  }
  if (state.status !== 'PENDING') {
    return failure('Only PENDING loans can be cancelled');
  }

  const cancelledEvent: LoanCancelledEvent = {
    name: 'LoanCancelled',
    aggregateId: state.id,
    version: state.version + 1,
    timestamp: new Date(),
    payload: { reason: command.payload.reason }
  };

  return success([cancelledEvent]);
};
