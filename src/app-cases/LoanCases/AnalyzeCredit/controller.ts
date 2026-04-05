import { Context } from 'hono';
import { analyzeCreditProcess } from './app-rules';
import { EventStore } from '../../../shared/EventStore';
import { createLoanProposalRepository } from '../../../domain/LoanProposal';

export const createAnalyzeCreditController = (eventStore: EventStore) => {
  const repo = createLoanProposalRepository(eventStore);
  const handleAnalyzeCredit = analyzeCreditProcess(repo);

  const httpPostAnalyzeCredit = async (c: Context) => {
    try {
      const reqBody = await c.req.json();
      if (!reqBody.proposalId) {
         return c.json({ success: false, error: 'proposalId is required' }, 400);
      }

      const result = await handleAnalyzeCredit(reqBody.proposalId);
      if (result.isSuccess) {
        return c.json({ success: true, message: 'Credit analyzed successfully' }, 200);
      }
      return c.json({ success: false, error: result.error }, 400);
    } catch (error) {
       return c.json({ success: false, error: 'Invalid JSON payload' }, 400);
    }
  };

  return { httpPostAnalyzeCredit };
}
