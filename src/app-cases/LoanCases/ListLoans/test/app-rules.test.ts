import { describe, it, expect } from 'vitest';
import { listLoansProcess } from '../app-rules';
import { requestLoanProcess } from '../../RequestLoan/app-rules';
import { createInMemoryEventStore } from '../../../../shared/InMemoryEventStore';
import { createLoanProposalRepository } from '../../../../infra/LoanProposalRepository';

const makeRepo = () => createLoanProposalRepository(createInMemoryEventStore());

const validCustomer = {
  id: 'c1',
  name: 'Alice',
  cpf: '12345678901',
  monthlyIncome: 5000,
};

describe('listLoansProcess', () => {
  it('retorna lista vacía cuando no hay préstamos', async () => {
    const result = await listLoansProcess(makeRepo())();

    expect(result.isSuccess).toBe(true);
    if (!result.isSuccess) return;
    expect(result.value).toEqual([]);
  });

  it('retorna todos los préstamos creados', async () => {
    const repo = makeRepo();
    await requestLoanProcess(repo)({ customer: validCustomer, requestedAmount: 1000, installments: 10 });
    await requestLoanProcess(repo)({ customer: { ...validCustomer, id: 'c2' }, requestedAmount: 2000, installments: 5 });

    const result = await listLoansProcess(repo)();

    expect(result.isSuccess).toBe(true);
    if (!result.isSuccess) return;
    expect(result.value).toHaveLength(2);
    expect(result.value.every(l => l?.status === 'PENDING')).toBe(true);
  });
});
