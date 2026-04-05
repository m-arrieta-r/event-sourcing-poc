import { randomUUID } from 'crypto';
import { Result, success, failure } from '../../../../shared/result';
import { Command } from './command';
import { LoanProposalEvent, LoanRequestedEvent } from '../../events';
import { LoanProposalState } from '../../aggregate';
import { isAmountValid } from '../../internal/isAmountValid';

export const decide = (
  command: Command,
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
    aggregateId: `loan-${randomUUID()}`,
    version: 1,
    timestamp: new Date(),
    payload: {
      customer: command.payload.customer,
      requestedAmount: command.payload.requestedAmount,
      installments: command.payload.installments,
    }
  };
  return success([event]);
};
