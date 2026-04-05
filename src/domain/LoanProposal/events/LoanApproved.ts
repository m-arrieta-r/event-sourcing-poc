import { DomainEvent } from '../../../shared/message';

export type LoanApprovedPayload = Record<string, never>;

export type LoanApprovedEvent = DomainEvent<'LoanApproved', LoanApprovedPayload>;
