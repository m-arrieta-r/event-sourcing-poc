import { Result, success, failure } from '../../../shared/result';
import { evaluateProposal } from '../../../domain/LoanProposal';
import { LoanProposal } from '../../../domain/LoanProposal/types';

export type GetProposalFn = (id: string) => Promise<Result<LoanProposal, string>>;
export type UpdateProposalFn = (proposal: LoanProposal) => Promise<Result<void, string>>;

export const analyzeCreditProcess = (getProposal: GetProposalFn, updateProposal: UpdateProposalFn) => 
  async (proposalId: string): Promise<Result<LoanProposal, string>> => {
    // 1. Fetch proposal
    const proposalResult = await getProposal(proposalId);
    if (!proposalResult.isSuccess) {
        return proposalResult;
    }
    
    let proposal = proposalResult.value;

    // 2. Business Rules Evaluation
    proposal = evaluateProposal(proposal);

    // 3. Persist state change
    const updateResult = await updateProposal(proposal);
    if (!updateResult.isSuccess) {
        return failure(`Failed to update proposal status: ${updateResult.error}`);
    }

    return success(proposal);
  };
