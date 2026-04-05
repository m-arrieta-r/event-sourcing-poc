import { Context } from 'hono';
import { listLoansProcess } from './app-rules';
import { EventStore } from '../../../shared/EventStore';
import { createLoanProposalRepository } from '../../../domain/LoanProposal';

export const createListLoansController = (eventStore: EventStore) => {
  const repo = createLoanProposalRepository(eventStore);
  const handleListLoans = listLoansProcess(repo);

  const httpGetListLoans = async (c: Context) => {
    try {
      const result = await handleListLoans();
      if (result.isSuccess) {
        return c.json({ success: true, data: result.value }, 200);
      }
      return c.json({ success: false, error: result.error }, 500);
    } catch (error) {
      return c.json({ success: false, error: 'Internal Server Error' }, 500);
    }
  };

  return { httpGetListLoans };
};
