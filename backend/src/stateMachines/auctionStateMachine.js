// Simple state transitions map (avoiding XState v5 complexity for state lookup)
const auctionTransitions = {
  open: { CLOSE: "closed", CANCEL: "cancelled", EXPIRE: "expired" },
  closed: { AWARD: "awarded", REOPEN: "open" },
  awarded: {}, // final state
  expired: {}, // final state
  cancelled: {}, // final state
};

function canTransition(currentState, event) {
  const transitions = auctionTransitions[currentState];
  if (!transitions) return false;
  return event in transitions;
}

function getNextState(currentState, event) {
  const transitions = auctionTransitions[currentState];
  if (!transitions) return currentState;
  return transitions[event] || currentState;
}

module.exports = {
  auctionTransitions,
  canTransition,
  getNextState,
};
