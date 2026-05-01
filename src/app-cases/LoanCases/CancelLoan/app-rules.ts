import { Result } from '../../../shared/result';
import { CancelLoan, LoanProposalRepository } from '../../../domain/LoanProposal';

export const cancelLoanProcess = (repo: LoanProposalRepository) =>
  async (proposalId: string, reason: string): Promise<Result<void, string>> => {
    const command: CancelLoan.Command = {
      name: 'CancelLoan',
      payload: { reason }
    };

    return repo.execute(proposalId, (state) => CancelLoan.decide(command, state));
  };
