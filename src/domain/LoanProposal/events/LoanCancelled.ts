import { DomainEvent } from '../../../shared/message';

export type LoanCancelledPayload = {
  reason: string;
};

export type LoanCancelledEvent = DomainEvent<'LoanCancelled', LoanCancelledPayload>;
