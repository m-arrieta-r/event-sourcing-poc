import { Result } from '../../../shared/result';
import { EvaluateLoan, LoanProposalRepository } from '../../../domain/LoanProposal';

export const analyzeCreditProcess = (repo: LoanProposalRepository) =>
  async (proposalId: string, correlationId?: string): Promise<Result<void, string>> => {
    const command: EvaluateLoan.Command = {
      name: 'EvaluateLoan',
      payload: {}
    };

    return repo.execute(proposalId, (state) => EvaluateLoan.decide(command, state), { correlationId });
  };
