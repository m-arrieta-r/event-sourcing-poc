import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { createSqliteEventStore } from './infra/EventStore';
import { createLoanProposalRepository } from './infra/LoanProposalRepository';
import { createRequestLoanController } from './app-cases/LoanCases/RequestLoan/controller';
import { createAnalyzeCreditController } from './app-cases/LoanCases/AnalyzeCredit/controller';
import { createListLoansController } from './app-cases/LoanCases/ListLoans/controller';

async function bootstrap() {
  console.log('--- Initializing Event Sourced application ---');

  // Initialize persistent SQLite-backed EventStore
  const eventStore = await createSqliteEventStore('./events.db');
  
  // Initialize Domain Repository
  const loanProposalRepo = createLoanProposalRepository(eventStore);

  // Initialize Controllers with Repository injected
  const { httpPostRequestLoan } = createRequestLoanController(loanProposalRepo);
  const { httpPostAnalyzeCredit } = createAnalyzeCreditController(loanProposalRepo);
  const { httpGetListLoans } = createListLoansController(loanProposalRepo);


  const app = new Hono();

  // Add basic health check
  app.get('/', (c) => c.text('Lending Origination System API'));

  // Wire up routes directly to controllers
  app.post('/request-loan', httpPostRequestLoan);
  app.post('/analyze-credit', httpPostAnalyzeCredit);
  app.get('/loans', httpGetListLoans);

  const port = 3000;
  console.log(`Server is running on port ${port}`);

  serve({
    fetch: app.fetch,
    port
  });
}

bootstrap().catch(console.error);
