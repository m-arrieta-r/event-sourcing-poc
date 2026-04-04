import { LoanProposalEvent } from './events';
import { LoanProposal } from './types';

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
  switch (event.name) {
    case 'LoanRequested': {
      return {
        id: event.aggregateId,
        customer: event.payload.customer,
        requestedAmount: event.payload.requestedAmount,
        installments: event.payload.installments,
        status: event.payload.status,
        createdAt: event.timestamp,
        version: event.version,
      };
    }
    
    case 'LoanApproved':
    case 'LoanRejected': {
      if (state === null) return null; // Defensive check
      
      return {
        ...state,
        status: event.payload.status,
        version: event.version
      };
    }
    
    default:
      return state;
  }
};
