import { requestLoanProcess, SaveProposalFn } from './app-rules';
import { success, failure, Result } from '../../../shared/result';

// Mock dependency implementation
const mockSaveProposal: SaveProposalFn = async (proposal) => {
  // In a real app, this calls a Database Repository
  console.log('Proposal saved to DB:', proposal);
  return success(undefined);
};

// Controller injects the dependencies 
const handleRequestLoan = requestLoanProcess(mockSaveProposal);

export const httpPostRequestLoan = async (reqBody: any): Promise<Result<any, string>> => {
  try {
    // Basic structural validation
    if (!reqBody.customer || !reqBody.requestedAmount || !reqBody.installments) {
      return failure('Invalid request structure');
    }

    const result = await handleRequestLoan(reqBody);
    return result;
  } catch (error) {
    return failure('Internal Server Error');
  }
};
