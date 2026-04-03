import { LoanProposal } from '../types';

export const rejectProposal = (proposal: LoanProposal): LoanProposal => {
  return { ...proposal, status: 'REJECTED' };
};
