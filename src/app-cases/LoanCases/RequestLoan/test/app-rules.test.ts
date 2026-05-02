import { describe, it, expect } from 'vitest';
import { requestLoanProcess } from '../app-rules';
import { createInMemoryEventStore } from '../../../../shared/InMemoryEventStore';
import { createLoanProposalRepository } from '../../../../infra/LoanProposalRepository';

const makeRepo = () => createLoanProposalRepository(createInMemoryEventStore());

const validCustomer = {
  id: 'c1',
  name: 'Alice',
  cpf: '12345678901',
  monthlyIncome: 5000,
};

describe('requestLoanProcess', () => {
  it('crea un préstamo con datos válidos', async () => {
    const result = await requestLoanProcess(makeRepo())({
      customer: validCustomer,
      requestedAmount: 1000,
      installments: 10,
    });

    expect(result.isSuccess).toBe(true);
  });

  it('falla si el monto está fuera del rango permitido', async () => {
    const result = await requestLoanProcess(makeRepo())({
      customer: validCustomer,
      requestedAmount: 99999,
      installments: 10,
    });

    expect(result.isSuccess).toBe(false);
  });
});
