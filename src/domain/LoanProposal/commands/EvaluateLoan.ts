import { Command } from '../../../shared/message';

export type EvaluateLoanPayload = {
  loanId: string;
};

export type EvaluateLoanCommand = Command<'EvaluateLoan', EvaluateLoanPayload>;
