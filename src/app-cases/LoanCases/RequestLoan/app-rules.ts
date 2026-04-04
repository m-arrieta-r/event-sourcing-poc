import { Result } from '../../../shared/result';
import { processRequestLoan, RequestLoanCommand } from '../../../domain/LoanProposal';
import { CustomerInfo } from '../../../domain/LoanProposal/types';
import { LoanProposalRepository } from '../../../domain/LoanProposal/repository';

export type RequestLoanInput = {
  customer: CustomerInfo;
  requestedAmount: number;
  installments: number;
};

// Use case logic curried with the repo dependency
export const requestLoanProcess = (repo: LoanProposalRepository) => 
  async (input: RequestLoanInput): Promise<Result<void, string>> => {
    
    // 1. Build the command
    const command: RequestLoanCommand = {
      name: 'RequestLoan',
      payload: {
        customer: input.customer,
        requestedAmount: input.requestedAmount,
        installments: input.installments
      }
    };

    // 2. Use the repo to validate against state and append new events.
    // Pass `null` for id since this is a creation command.
    return repo.execute(null, (state) => processRequestLoan(command, state));
  };
