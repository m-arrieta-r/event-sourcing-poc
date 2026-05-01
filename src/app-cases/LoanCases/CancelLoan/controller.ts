import { Context } from 'hono';
import { cancelLoanProcess } from './app-rules';
import { LoanProposalRepository } from '../../../domain/LoanProposal';

export const createCancelLoanController = (repo: LoanProposalRepository) => {
  const handleCancelLoan = cancelLoanProcess(repo);

  const httpPostCancelLoan = async (c: Context) => {
    try {
      const reqBody = await c.req.json();
      if (!reqBody.proposalId) {
        return c.json({ success: false, error: 'proposalId is required' }, 400);
      }
      if (!reqBody.reason || typeof reqBody.reason !== 'string' || reqBody.reason.trim() === '') {
        return c.json({ success: false, error: 'reason is required' }, 400);
      }

      const result = await handleCancelLoan(reqBody.proposalId, reqBody.reason.trim());
      if (result.isSuccess) {
        return c.json({ success: true, message: 'Loan cancelled successfully' }, 200);
      }
      return c.json({ success: false, error: result.error }, 400);
    } catch {
      return c.json({ success: false, error: 'Invalid JSON payload' }, 400);
    }
  };

  return { httpPostCancelLoan };
};
