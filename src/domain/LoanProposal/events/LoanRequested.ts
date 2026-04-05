import { DomainEvent } from '../../../shared/message';
import { CustomerInfo } from '../types';

export type LoanRequestedPayload = {
  customer: CustomerInfo;
  requestedAmount: number;
  installments: number;
};

export type LoanRequestedEvent = DomainEvent<'LoanRequested', LoanRequestedPayload>;
