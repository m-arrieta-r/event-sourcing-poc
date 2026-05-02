import { describe, it, expect, beforeEach } from 'vitest';
import { analyzeCreditProcess } from '../app-rules';
import { requestLoanProcess } from '../../RequestLoan/app-rules';
import { listLoansProcess } from '../../ListLoans/app-rules';
import { createInMemoryEventStore } from '../../../../shared/InMemoryEventStore';
import { createLoanProposalRepository } from '../../../../infra/LoanProposalRepository';
import { LoanProposalRepository } from '../../../../domain/LoanProposal/repository';

const validCustomer = (monthlyIncome: number) => ({
  id: 'c1',
  name: 'Alice',
  cpf: '12345678901',
  monthlyIncome,
});

const createRepoWithPendingLoan = async (monthlyIncome: number, requestedAmount: number, installments: number) => {
  const repo = createLoanProposalRepository(createInMemoryEventStore());
  await requestLoanProcess(repo)({ customer: validCustomer(monthlyIncome), requestedAmount, installments });
  const loans = await listLoansProcess(repo)();
  if (!loans.isSuccess || loans.value.length === 0 || !loans.value[0]) throw new Error('setup failed');
  return { repo, proposalId: loans.value[0].id };
};

describe('analyzeCreditProcess', () => {
  it('aprueba un préstamo cuando el ingreso es suficiente', async () => {
    // 1000 / 10 = 100/mes <= 1500 (30% de 5000)
    const { repo, proposalId } = await createRepoWithPendingLoan(5000, 1000, 10);

    const result = await analyzeCreditProcess(repo)(proposalId);
    expect(result.isSuccess).toBe(true);

    const loans = await listLoansProcess(repo)();
    if (!loans.isSuccess) throw new Error();
    expect(loans.value[0]?.status).toBe('APPROVED');
  });

  it('rechaza un préstamo cuando el ingreso es insuficiente', async () => {
    // 20000 / 5 = 4000/mes > 1500 (30% de 5000)
    const { repo, proposalId } = await createRepoWithPendingLoan(5000, 20000, 5);

    const result = await analyzeCreditProcess(repo)(proposalId);
    expect(result.isSuccess).toBe(true);

    const loans = await listLoansProcess(repo)();
    if (!loans.isSuccess) throw new Error();
    expect(loans.value[0]?.status).toBe('REJECTED');
  });

  it('falla si el préstamo no existe', async () => {
    const repo = createLoanProposalRepository(createInMemoryEventStore());
    const result = await analyzeCreditProcess(repo)('loan-inexistente');

    expect(result.isSuccess).toBe(false);
  });

  it('falla si el préstamo ya fue evaluado', async () => {
    const { repo, proposalId } = await createRepoWithPendingLoan(5000, 1000, 10);
    await analyzeCreditProcess(repo)(proposalId);

    const result = await analyzeCreditProcess(repo)(proposalId);
    expect(result.isSuccess).toBe(false);
  });
});
