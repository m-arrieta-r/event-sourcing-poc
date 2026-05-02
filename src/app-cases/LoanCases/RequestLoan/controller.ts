import { randomUUID } from 'crypto';
import { Context } from 'hono';
import { requestLoanProcess } from './app-rules';
import { LoanProposalRepository, parseCustomerInfo } from '../../../domain/LoanProposal';

export const createRequestLoanController = (repo: LoanProposalRepository) => {
  const handleRequestLoan = requestLoanProcess(repo);

  const httpPostRequestLoan = async (c: Context) => {
    try {
      const reqBody = await c.req.json();

      // Validate and parse CustomerInfo through the domain smart constructor
      const customerResult = parseCustomerInfo(reqBody.customer);
      if (!customerResult.isSuccess) {
        return c.json({ success: false, error: customerResult.error }, 400);
      }

      if (typeof reqBody.requestedAmount !== 'number' || typeof reqBody.installments !== 'number') {
        return c.json({ success: false, error: 'requestedAmount and installments must be numbers' }, 400);
      }

      const correlationId = c.req.header('x-correlation-id') ?? randomUUID();
      const result = await handleRequestLoan({
        customer: customerResult.value,
        requestedAmount: reqBody.requestedAmount,
        installments: reqBody.installments,
      }, correlationId);

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
