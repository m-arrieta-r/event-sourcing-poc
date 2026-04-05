const serverUrl = 'http://localhost:3000';

async function runTests() {
  console.log('--- Starting End-to-End Test ---');
  
  console.log('\n1. Checking loans (should be empty)');
  let res = await fetch(`${serverUrl}/loans`);
  let data = await res.json() as any;
  console.log('Result:', data);

  console.log('\n2. Requesting a new loan for Alice');
  res = await fetch(`${serverUrl}/request-loan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer: { id: "c1", name: "Alice", cpf: "12345678901", monthlyIncome: 5000 },
      requestedAmount: 1000,
      installments: 10
    })
  });
  data = await res.json() as any;
  console.log('Result:', data);

  console.log('\n3. Fetching loans to get the proposal ID');
  res = await fetch(`${serverUrl}/loans`);
  data = await res.json() as any;
  console.log('Result:', data);
  
  if (!data.data || data.data.length === 0) {
    console.error('No loans found!');
    return;
  }
  
  const proposalId = data.data[0].id;
  console.log(`\nExtracted Proposal ID: ${proposalId}`);

  console.log('\n4. Analyzing credit for the proposal');
  res = await fetch(`${serverUrl}/analyze-credit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proposalId })
  });
  data = await res.json() as any;
  console.log('Result:', data);

  console.log('\n5. Fetching loans again to see final state');
  res = await fetch(`${serverUrl}/loans`);
  data = await res.json() as any;
  console.log('Result:', JSON.stringify(data, null, 2));
}

runTests().catch(console.error);
