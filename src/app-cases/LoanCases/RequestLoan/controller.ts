import { Context } from 'hono';
import { requestLoanProcess } from './app-rules';
import { EventStore } from '../../../shared/EventStore';
import { createLoanProposalRepository } from '../../../domain/LoanProposal';

export const createRequestLoanController = (eventStore: EventStore) => {
  const repo = createLoanProposalRepository(eventStore);
  const handleRequestLoan = requestLoanProcess(repo);

  const httpPostRequestLoan = async (c: Context) => {
    try {
      const reqBody = await c.req.json();
      if (!reqBody.customer || !reqBody.requestedAmount || !reqBody.installments) {
        return c.json({ success: false, error: 'Invalid request structure' }, 400);
      }

      const result = await handleRequestLoan(reqBody);
      
      if (result.isSuccess) {
        return c.json({ success: true, message: 'Loan requested successfully' }, 201);
      }
      return c.json({ success: false, error: result.error }, 400);
    } catch (error) {
      return c.json({ success: false, error: 'Invalid JSON payload' }, 400);
    }
  };

  return { httpPostRequestLoan };
};
