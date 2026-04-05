import { Command as BaseCommand } from '../../../../shared/message';
import { CustomerInfo } from '../../types';

export type RequestLoanPayload = {
  customer: CustomerInfo;
  requestedAmount: number;
  installments: number;
};

export type Command = BaseCommand<'RequestLoan', RequestLoanPayload>;
