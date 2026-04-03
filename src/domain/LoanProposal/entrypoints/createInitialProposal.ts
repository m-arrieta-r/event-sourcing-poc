import { Result, success, failure } from '../../../shared/result';
import { CustomerInfo, LoanProposal } from '../types';
import { isAmountValid } from '../internal/isAmountValid';

export const createInitialProposal = (
  customer: CustomerInfo,
  requestedAmount: number,
  installments: number
): Result<LoanProposal, string> => {
  if (!isAmountValid(requestedAmount)) {
    return failure('Requested amount is out of allowed range.');
  }

  const proposal: LoanProposal = {
    id: `loan-${Date.now()}`,
    customer,
    requestedAmount,
    installments,
    status: 'PENDING',
    createdAt: new Date(),
  };

  return success(proposal);
};
