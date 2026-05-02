import { Result } from '../../../shared/result';
import { RequestLoan, CustomerInfo, LoanProposalRepository } from '../../../domain/LoanProposal';

export type RequestLoanInput = {
  customer: CustomerInfo;
  requestedAmount: number;
  installments: number;
};

export const requestLoanProcess = (repo: LoanProposalRepository) =>
  async (input: RequestLoanInput, correlationId?: string): Promise<Result<void, string>> => {
    const command: RequestLoan.Command = {
      name: 'RequestLoan',
      payload: {
        customer: input.customer,
        requestedAmount: input.requestedAmount,
        installments: input.installments
      }
    };

    return repo.execute(null, (state) => RequestLoan.decide(command, state), { correlationId });
  };
