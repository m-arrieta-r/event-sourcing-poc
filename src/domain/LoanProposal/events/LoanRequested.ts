import { DomainEvent } from '../../../shared/message';
import { CustomerInfo, LoanStatus } from '../types';

export type LoanRequestedPayload = {
  customer: CustomerInfo;
  requestedAmount: number;
  installments: number;
  status: LoanStatus;
};

export type LoanRequestedEvent = DomainEvent<'LoanRequested', LoanRequestedPayload>;
