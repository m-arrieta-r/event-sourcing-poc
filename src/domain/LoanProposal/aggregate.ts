import { LoanProposalEvent } from './events';
import { LoanProposal } from './types';
import { reducers } from './reducers';

// The state could be null if the aggregate hasn't been created yet
export type LoanProposalState = LoanProposal | null;

/**
 * apply takes the current State and an Event, and returns the NEW State.
 * This is used to rebuild the object by replaying all past events.
 * THIS MUST BE A PURE FUNCTION WITH NO SIDE EFFECTS OR BUSINESS RULES.
 */
export const apply = (
  state: LoanProposalState,
  event: LoanProposalEvent
): LoanProposalState => {
  const handler = reducers[event.name];
  return handler ? handler(state, event) : state;
};
