import { analyzeCreditProcess, GetProposalFn, UpdateProposalFn } from './app-rules';
import { success, failure, Result } from '../../../shared/result';

// Mock dependencies
const mockGetProposal: GetProposalFn = async (id) => {
  return success({
    id,
    customer: { id: 'c1', name: 'John Doe', cpf: '12345678900', monthlyIncome: 10000 },
    requestedAmount: 5000,
    installments: 12,
    status: 'PENDING',
    createdAt: new Date()
  });
};

const mockUpdateProposal: UpdateProposalFn = async (proposal) => {
  console.log('Proposal state updated in DB:', proposal);
  return success(undefined);
};

// Dependency Injection
const handleAnalyzeCredit = analyzeCreditProcess(mockGetProposal, mockUpdateProposal);

export const httpPostAnalyzeCredit = async (reqBody: { proposalId: string }): Promise<Result<any, string>> => {
  if (!reqBody.proposalId) {
     return failure('proposalId is required');
  }

  const result = await handleAnalyzeCredit(reqBody.proposalId);
  return result;
};
