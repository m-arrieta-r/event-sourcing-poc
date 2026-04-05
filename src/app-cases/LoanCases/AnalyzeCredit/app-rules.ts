import { Result } from '../../../shared/result';
import { EvaluateLoan, LoanProposalRepository } from '../../../domain/LoanProposal';

export const analyzeCreditProcess = (repo: LoanProposalRepository) => 
  async (proposalId: string): Promise<Result<void, string>> => {
    
    // Build Command
    const command: EvaluateLoan.Command = {
      name: 'EvaluateLoan',
      payload: {}
    };

    // Use the repository to load state, evaluate command, and append events
    return repo.execute(proposalId, (state) => EvaluateLoan.decide(command, state));
  };
