import { DomainEvent } from '../../../shared/message';
import { LoanStatus } from '../types';

export type LoanApprovedPayload = {
  status: LoanStatus;
};

export type LoanApprovedEvent = DomainEvent<'LoanApproved', LoanApprovedPayload>;
