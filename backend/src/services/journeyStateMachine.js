const { createMachine, createActor } = require("xstate");

// State machine for farmer journey - enforces correct activity sequence
const farmerJourneyMachine = createMachine({
    id: "farmerJourney",
    initial: "idle",
    states: {
        idle: {
            on: { SEEDING: "seeding" }
        },
        seeding: {
            on: { 
                WATERING: "watering"
            }
        },
        watering: {
            on: { 
                WATERING: "watering",       // Can water multiple times
                FERTILIZER: "fertilizer"
            }
        },
        fertilizer: {
            on: { 
                FERTILIZER: "fertilizer",   // Can fertilize multiple times
                PESTICIDE: "pesticide",
                HARVEST: "harvest"          // Skip pesticide if organic!
            }
        },
        pesticide: {
            on: { 
                PESTICIDE: "pesticide",     // Can apply multiple times
                HARVEST: "harvest"
            }
        },
        harvest: {
            on: { PACKED: "packed" }
        },
        packed: {
            on: { SHIPPED: "shipped" }
        },
        shipped: {
            type: "final"
        }
    }
});

// Get allowed next activities from current state
function getAllowedActivities(currentState) {
    const stateNode = farmerJourneyMachine.states[currentState];
    if (!stateNode || !stateNode.on) return [];
    return Object.keys(stateNode.on);
}

// Check if activity is allowed from current state
function canDoActivity(currentState, activityType) {
    const allowed = getAllowedActivities(currentState);
    return allowed.includes(activityType);
}

// Get next state after performing activity
function getNextState(currentState, activityType) {
    const stateNode = farmerJourneyMachine.states[currentState];
    if (!stateNode || !stateNode.on) return currentState;
    return stateNode.on[activityType] || currentState;
}

// Check if journey is complete
function isJourneyComplete(currentState) {
    return currentState === "shipped";
}

// Get human-readable state name
function getStateLabel(state) {
    const labels = {
        idle: "Not Started",
        seeding: "Seeds Planted",
        watering: "Watering Phase",
        fertilizer: "Fertilizing Phase",
        pesticide: "Pest Control Phase",
        harvest: "Harvested",
        packed: "Packed",
        shipped: "Shipped"
    };
    return labels[state] || state;
}

module.exports = {
    farmerJourneyMachine,
    getAllowedActivities,
    canDoActivity,
    getNextState,
    isJourneyComplete,
    getStateLabel
};
