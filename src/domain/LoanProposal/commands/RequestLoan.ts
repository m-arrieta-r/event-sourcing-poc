import { Command } from '../../../shared/message';
import { CustomerInfo } from '../types';

export type RequestLoanPayload = {
  customer: CustomerInfo;
  requestedAmount: number;
  installments: number;
};

export type RequestLoanCommand = Command<'RequestLoan', RequestLoanPayload>;
