import { createInMemoryEventStore } from './shared/InMemoryEventStore';
import { createRequestLoanController } from './app-cases/LoanCases/RequestLoan/controller';
import { createAnalyzeCreditController } from './app-cases/LoanCases/AnalyzeCredit/controller';

async function main() {
  console.log('--- Initializing Event Sourced application ---');
  // 1. Initialize the global EventStore instance (in-memory POC)
  const eventStore = createInMemoryEventStore();

  // 2. Initialize Controllers with EventStore injected
  const { httpPostRequestLoan } = createRequestLoanController(eventStore);
  const { httpPostAnalyzeCredit } = createAnalyzeCreditController(eventStore);

  console.log('\n--- Scenario 1: User requests a loan ---');
  const requestBody = {
    customer: { id: 'c1', name: 'Alice', cpf: '12345678900', monthlyIncome: 4000 },
    requestedAmount: 1000,
    installments: 10 // 100/mo < 1200 (30% of 4000), should approve
  };
  
  const requestResult = await httpPostRequestLoan(requestBody);
  console.log('Request Result:', requestResult);

  if (!requestResult.isSuccess || !requestResult.value) {
    return;
  }

  const proposalId = requestResult.value.id;

  // Let's verify events in the store
  const pastEvents = await eventStore.loadEvents(proposalId);
  console.log(`Events in store for ${proposalId}:`, pastEvents.map(e => e.name));

  console.log('\n--- Scenario 2: System analyzes credit ---');
  const analyzeBody = { proposalId };
  const analyzeResult = await httpPostAnalyzeCredit(analyzeBody);
  console.log('Analyze Result:', analyzeResult);

  // Verify final events
  const finalEvents = await eventStore.loadEvents(proposalId);
  console.log(`Final events in store for ${proposalId}:`, finalEvents.map(e => e.name));
}

// Ensure execution if run directly
if (require.main === module) {
    main().catch(console.error);
}
