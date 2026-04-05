import { Result, success } from '../../../shared/result';
import { LoanProposalState } from '../../../domain/LoanProposal';
import { LoanProposalRepository } from '../../../domain/LoanProposal/repository';

export const listLoansProcess = (repo: LoanProposalRepository) => 
  async (): Promise<Result<LoanProposalState[], string>> => {
    const loans = await repo.loadAll();
    return success(loans);
  };
