import { Result } from '../../../shared/result';
import { RequestLoan, CustomerInfo, LoanProposalRepository } from '../../../domain/LoanProposal';

export type RequestLoanInput = {
  customer: CustomerInfo;
  requestedAmount: number;
  installments: number;
};

// Use case logic curried with the repo dependency
export const requestLoanProcess = (repo: LoanProposalRepository) => 
  async (input: RequestLoanInput): Promise<Result<void, string>> => {
    
    // 1. Build the command
    const command: RequestLoan.Command = {
      name: 'RequestLoan',
      payload: {
        customer: input.customer,
        requestedAmount: input.requestedAmount,
        installments: input.installments
      }
    };

    // 2. Use the repo to validate against state and append new events.
    // Pass `null` for id since this is a creation command.
    return repo.execute(null, (state) => RequestLoan.decide(command, state));
  };
