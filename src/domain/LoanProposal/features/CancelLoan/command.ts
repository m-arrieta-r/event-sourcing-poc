import { Command as BaseCommand } from '../../../../shared/message';

export type Command = BaseCommand<'CancelLoan', { reason: string }>;
