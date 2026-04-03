import { DomainEvent } from '../../../shared/message';
import { LoanStatus } from '../types';

export type LoanRejectedPayload = {
  status: LoanStatus;
};

export type LoanRejectedEvent = DomainEvent<'LoanRejected', LoanRejectedPayload>;
