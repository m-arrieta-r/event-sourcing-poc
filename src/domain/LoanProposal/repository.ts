import { Result } from '../../shared/result';
import { LoanProposalEvent } from './events';
import { LoanProposalState } from './aggregate';

export type LoanProposalRepository = {
  load: (id: string) => Promise<LoanProposalState>;
  loadAll: () => Promise<LoanProposalState[]>;
  execute: (
    id: string | null,
    process: (state: LoanProposalState) => Result<LoanProposalEvent[], string>
  ) => Promise<Result<void, string>>;
};
