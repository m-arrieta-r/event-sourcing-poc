import { Result } from '../../shared/result';
import { LoanProposalEvent } from './events';
import { LoanProposalState } from './aggregate';

export type CommandMetadata = {
  correlationId?: string;
  causationId?: string;
};

export type LoanProposalRepository = {
  load: (id: string) => Promise<LoanProposalState>;
  loadAll: () => Promise<LoanProposalState[]>;
  execute: (
    id: string | null,
    process: (state: LoanProposalState) => Result<LoanProposalEvent[], string>,
    metadata?: CommandMetadata
  ) => Promise<Result<void, string>>;
};
