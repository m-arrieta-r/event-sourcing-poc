import { Result, success, failure } from '../../../shared/result';
import { createInitialProposal } from '../../../domain/LoanProposal';
import { CustomerInfo, LoanProposal } from '../../../domain/LoanProposal/types';

// Dependencies injected as pure functions
export type SaveProposalFn = (proposal: LoanProposal) => Promise<Result<void, string>>;

export type RequestLoanInput = {
  customer: CustomerInfo;
  requestedAmount: number;
  installments: number;
};

// Use case logic curried with dependencies
export const requestLoanProcess = (saveProposal: SaveProposalFn) => 
  async (input: RequestLoanInput): Promise<Result<LoanProposal, string>> => {
    // 1. Domain validation
    const proposalResult = createInitialProposal(input.customer, input.requestedAmount, input.installments);
    if (!proposalResult.isSuccess) {
      return proposalResult;
    }

    const proposal = proposalResult.value;

    // 2. Persist proposal
    const saved = await saveProposal(proposal);
    if (!saved.isSuccess) {
      return failure(`Failed to save proposal: ${saved.error}`);
    }

    return success(proposal);
  };
