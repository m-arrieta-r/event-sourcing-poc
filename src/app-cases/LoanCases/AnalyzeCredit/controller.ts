import { analyzeCreditProcess } from './app-rules';
import { failure, Result } from '../../../shared/result';
import { EventStore } from '../../../shared/EventStore';
import { createLoanProposalRepository } from '../../../domain/LoanProposal';

export const createAnalyzeCreditController = (eventStore: EventStore) => {
  const repo = createLoanProposalRepository(eventStore);
  const handleAnalyzeCredit = analyzeCreditProcess(repo);

  const httpPostAnalyzeCredit = async (reqBody: { proposalId: string }): Promise<Result<any, string>> => {
    if (!reqBody.proposalId) {
       return failure('proposalId is required');
    }

    const result = await handleAnalyzeCredit(reqBody.proposalId);
    return result;
  };

  return { httpPostAnalyzeCredit };
}
