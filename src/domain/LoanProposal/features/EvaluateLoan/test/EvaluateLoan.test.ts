import { describe, it, expect } from 'vitest';
import { decide, evolvers } from '../index';
import { LoanProposal } from '../../../types';

const customer = {
  id: 'c1',
  name: 'Alice',
  cpf: '12345678901',
  monthlyIncome: 5000,
};

const evaluateCommand = { name: 'EvaluateLoan' as const, payload: {} };

const pendingState = (monthlyIncome: number, requestedAmount: number, installments: number): LoanProposal => ({
  id: 'loan-123',
  customer: { ...customer, monthlyIncome },
  requestedAmount,
  installments,
  status: 'PENDING',
  createdAt: new Date(),
  version: 1,
});

describe('EvaluateLoan.decide', () => {
  it('aprueba cuando el ingreso es suficiente (cuota <= 30% del ingreso)', () => {
    // 1000 / 10 cuotas = 100/mes <= 1500 (30% de 5000)
    const result = decide(evaluateCommand, pendingState(5000, 1000, 10));

    expect(result.isSuccess).toBe(true);
    if (!result.isSuccess) return;
    expect(result.value[0].name).toBe('LoanApproved');
  });

  it('rechaza cuando el ingreso es insuficiente (cuota > 30% del ingreso)', () => {
    // 20000 / 5 cuotas = 4000/mes > 1500 (30% de 5000)
    const result = decide(evaluateCommand, pendingState(5000, 20000, 5));

    expect(result.isSuccess).toBe(true);
    if (!result.isSuccess) return;
    expect(result.value[0].name).toBe('LoanRejected');
  });

  it('falla si el préstamo no existe', () => {
    const result = decide(evaluateCommand, null);

    expect(result.isSuccess).toBe(false);
    if (result.isSuccess) return;
    expect(result.error).toBe('Loan Proposal does not exist');
  });

  it('falla si el préstamo ya fue aprobado', () => {
    const state: LoanProposal = { ...pendingState(5000, 1000, 10), status: 'APPROVED' };
    const result = decide(evaluateCommand, state);

    expect(result.isSuccess).toBe(false);
    if (result.isSuccess) return;
    expect(result.error).toBe('Loan Proposal is not in PENDING status');
  });

  it('falla si el préstamo ya fue rechazado', () => {
    const state: LoanProposal = { ...pendingState(5000, 1000, 10), status: 'REJECTED' };
    const result = decide(evaluateCommand, state);

    expect(result.isSuccess).toBe(false);
    if (result.isSuccess) return;
    expect(result.error).toBe('Loan Proposal is not in PENDING status');
  });
});

describe('EvaluateLoan.evolvers', () => {
  const base = pendingState(5000, 1000, 10);
  const baseEvent = { aggregateId: 'loan-123', version: 2, timestamp: new Date(), payload: {} };

  it('LoanApproved actualiza el estado a APPROVED', () => {
    const event = { ...baseEvent, name: 'LoanApproved' as const };
    const state = evolvers.LoanApproved(base, event);

    expect(state?.status).toBe('APPROVED');
    expect(state?.version).toBe(2);
  });

  it('LoanRejected actualiza el estado a REJECTED', () => {
    const event = { ...baseEvent, name: 'LoanRejected' as const };
    const state = evolvers.LoanRejected(base, event);

    expect(state?.status).toBe('REJECTED');
    expect(state?.version).toBe(2);
  });
});
