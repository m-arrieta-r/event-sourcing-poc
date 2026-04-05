import { Result } from '../../../shared/result';
import { processEvaluateLoan, EvaluateLoanCommand } from '../../../domain/LoanProposal';
import { LoanProposalRepository } from '../../../domain/LoanProposal/repository';

export const analyzeCreditProcess = (repo: LoanProposalRepository) => 
  async (proposalId: string): Promise<Result<void, string>> => {
    
    // Build Command
    const command: EvaluateLoanCommand = {
      name: 'EvaluateLoan',
      payload: {}
    };

    // Use the repository to load state, evaluate command, and append events
    return repo.execute(proposalId, (state) => processEvaluateLoan(command, state));
  };
