import { describe, it, expect } from 'vitest';
import { decide, evolvers } from '../index';
import { LoanProposal } from '../../../types';

const validCustomer = {
  id: 'c1',
  name: 'Alice',
  cpf: '12345678901',
  monthlyIncome: 5000,
};

const validCommand = {
  name: 'RequestLoan' as const,
  payload: { customer: validCustomer, requestedAmount: 1000, installments: 10 },
};

const existingState: LoanProposal = {
  id: 'loan-123',
  customer: validCustomer,
  requestedAmount: 1000,
  installments: 10,
  status: 'PENDING',
  createdAt: new Date(),
  version: 1,
};

describe('RequestLoan.decide', () => {
  it('genera LoanRequestedEvent cuando el estado es null y el monto es válido', () => {
    const result = decide(validCommand, null);

    expect(result.isSuccess).toBe(true);
    if (!result.isSuccess) return;
    expect(result.value).toHaveLength(1);
    expect(result.value[0].name).toBe('LoanRequested');
    expect(result.value[0].payload.requestedAmount).toBe(1000);
  });

  it('falla si el préstamo ya existe', () => {
    const result = decide(validCommand, existingState);

    expect(result.isSuccess).toBe(false);
    if (result.isSuccess) return;
    expect(result.error).toBe('Loan Proposal already exists');
  });

  it('falla si el monto es 0', () => {
    const command = { ...validCommand, payload: { ...validCommand.payload, requestedAmount: 0 } };
    const result = decide(command, null);

    expect(result.isSuccess).toBe(false);
    if (result.isSuccess) return;
    expect(result.error).toBe('Requested amount is out of allowed range.');
  });

  it('falla si el monto supera el máximo permitido (50000)', () => {
    const command = { ...validCommand, payload: { ...validCommand.payload, requestedAmount: 60000 } };
    const result = decide(command, null);

    expect(result.isSuccess).toBe(false);
    if (result.isSuccess) return;
    expect(result.error).toBe('Requested amount is out of allowed range.');
  });
});

describe('RequestLoan.evolvers.LoanRequested', () => {
  it('construye el estado PENDING a partir del evento', () => {
    const event = {
      name: 'LoanRequested' as const,
      aggregateId: 'loan-abc',
      version: 1,
      timestamp: new Date(),
      payload: { customer: validCustomer, requestedAmount: 1000, installments: 10 },
    };

    const state = evolvers.LoanRequested(null, event);

    expect(state).not.toBeNull();
    if (!state) return;
    expect(state.status).toBe('PENDING');
    expect(state.id).toBe('loan-abc');
    expect(state.requestedAmount).toBe(1000);
    expect(state.customer).toEqual(validCustomer);
  });
});
