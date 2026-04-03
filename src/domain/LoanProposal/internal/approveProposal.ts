import { LoanProposal } from '../types';

export const approveProposal = (proposal: LoanProposal): LoanProposal => {
  return { ...proposal, status: 'APPROVED' };
};
