import { requestLoanProcess } from './app-rules';
import { failure, Result } from '../../../shared/result';
import { EventStore } from '../../../shared/EventStore';
import { createLoanProposalRepository } from '../../../domain/LoanProposal';

// In a real application, the EventStore instance is generally passed down from an IoC container
export const createRequestLoanController = (eventStore: EventStore) => {
  const repo = createLoanProposalRepository(eventStore);
  const handleRequestLoan = requestLoanProcess(repo);

  const httpPostRequestLoan = async (reqBody: any): Promise<Result<any, string>> => {
    try {
      if (!reqBody.customer || !reqBody.requestedAmount || !reqBody.installments) {
        return failure('Invalid request structure');
      }

      const result = await handleRequestLoan(reqBody);
      return result;
    } catch (error) {
      return failure('Internal Server Error');
    }
  };

  return { httpPostRequestLoan };
};
