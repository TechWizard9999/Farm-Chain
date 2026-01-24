// Simple state transitions map (avoiding XState v5 complexity for state lookup)
const journeyTransitions = {
  idle: { SEEDING: "seeding" },
  seeding: { WATERING: "watering" },
  watering: { WATERING: "watering", FERTILIZER: "fertilizer" },
  fertilizer: {
    FERTILIZER: "fertilizer",
    PESTICIDE: "pesticide",
    HARVEST: "harvest",
  },
  pesticide: { PESTICIDE: "pesticide", HARVEST: "harvest" },
  harvest: { PACKED: "packed" },
  packed: { SHIPPED: "shipped" },
  shipped: {}, // final state
};

function getAllowedActivities(currentState) {
  const transitions = journeyTransitions[currentState];
  if (!transitions) return [];
  return Object.keys(transitions);
}

function canDoActivity(currentState, activityType) {
  const allowed = getAllowedActivities(currentState);
  return allowed.includes(activityType);
}

function getNextState(currentState, activityType) {
  const transitions = journeyTransitions[currentState];
  if (!transitions) return currentState;
  return transitions[activityType] || currentState;
}

function isJourneyComplete(currentState) {
  return currentState === "shipped";
}

function getStateLabel(state) {
  const labels = {
    idle: "Not Started",
    seeding: "Seeds Planted",
    watering: "Watering Phase",
    fertilizer: "Fertilizing Phase",
    pesticide: "Pest Control Phase",
    harvest: "Harvested",
    packed: "Packed",
    shipped: "Shipped",
  };
  return labels[state] || state;
}

module.exports = {
  journeyTransitions,
  getAllowedActivities,
  canDoActivity,
  getNextState,
  isJourneyComplete,
  getStateLabel,
};
