import { DomainEvent } from '../../../shared/message';

export type LoanRejectedPayload = Record<string, never>;

export type LoanRejectedEvent = DomainEvent<'LoanRejected', LoanRejectedPayload>;
