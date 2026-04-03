import { LoanProposal } from '../types';
import { isIncomeSufficient } from '../internal/isIncomeSufficient';
import { approveProposal } from '../internal/approveProposal';
import { rejectProposal } from '../internal/rejectProposal';

export const evaluateProposal = (proposal: LoanProposal): LoanProposal => {
  if (isIncomeSufficient(proposal.customer.monthlyIncome, proposal.requestedAmount, proposal.installments)) {
    return approveProposal(proposal);
  }
  return rejectProposal(proposal);
};
