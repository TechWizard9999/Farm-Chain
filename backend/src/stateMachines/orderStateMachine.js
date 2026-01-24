// Simple state transitions map (avoiding XState v5 complexity for state lookup)
const orderTransitions = {
  pending: { CONFIRM: "confirmed", CANCEL: "cancelled" },
  confirmed: { SHIP: "shipped", CANCEL: "cancelled" },
  shipped: { DELIVER: "delivered" },
  delivered: { COMPLETE: "completed" },
  completed: {}, // final state
  cancelled: {}, // final state
};

function canTransition(currentState, event) {
  const transitions = orderTransitions[currentState];
  if (!transitions) return false;
  return event in transitions;
}

function getNextState(currentState, event) {
  const transitions = orderTransitions[currentState];
  if (!transitions) return currentState;
  return transitions[event] || currentState;
}

function getAllowedEvents(currentState) {
  const transitions = orderTransitions[currentState];
  if (!transitions) return [];
  return Object.keys(transitions);
}

function isFinalState(state) {
  return state === "completed" || state === "cancelled";
}

module.exports = {
  orderTransitions,
  canTransition,
  getNextState,
  getAllowedEvents,
  isFinalState,
};
