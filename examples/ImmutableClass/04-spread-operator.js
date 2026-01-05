/**
 * Spread Operator Example
 * Create new objects with modified properties
 * 
 * Run: bun run examples/04-spread-operator.js
 */

console.log("=== Spread Operator Example ===\n");

// Basic usage
const original = { x: 1, y: 2, z: 3 };
const updated = { ...original, y: 10 };

console.log("Original:", original); // { x: 1, y: 2, z: 3 }
console.log("Updated:", updated);   // { x: 1, y: 10, z: 3 }

// Original is unchanged
console.log("Original after update:", original); // { x: 1, y: 2, z: 3 }

// Adding new properties
const extended = { ...original, w: 4 };
console.log("Extended:", extended); // { x: 1, y: 2, z: 3, w: 4 }

// Array spread
console.log("\n--- Array Spread ---");

const numbers = [1, 2, 3];
const moreNumbers = [...numbers, 4, 5];
console.log("Original array:", numbers);      // [1, 2, 3]
console.log("Extended array:", moreNumbers);  // [1, 2, 3, 4, 5]

// Limitation: Shallow copy
console.log("\n--- Limitation: Shallow Copy ---");

const state = { user: { profile: { name: "A" } } };
const shallowCopy = { ...state };

shallowCopy.user.profile.name = "B";
console.log("Original state after shallow copy mutation:", state.user.profile.name); // "B" - MUTATED!

// Deep update (verbose but correct)
console.log("\n--- Deep Update (Verbose) ---");

const state2 = { user: { profile: { name: "A" } } };
const newState = {
  ...state2,
  user: { 
    ...state2.user, 
    profile: { 
      ...state2.user.profile, 
      name: "B" 
    } 
  }
};

console.log("Original state2:", state2.user.profile.name); // "A" - unchanged
console.log("New state:", newState.user.profile.name);     // "B"

// Helper function for deep updates
console.log("\n--- Helper Function for Deep Updates ---");

function updateIn(obj, path, value) {
  const [head, ...tail] = path;
  if (tail.length === 0) {
    return { ...obj, [head]: value };
  }
  return { ...obj, [head]: updateIn(obj[head], tail, value) };
}

const state3 = { user: { profile: { name: "A", age: 30 } } };
const updated3 = updateIn(state3, ['user', 'profile', 'name'], "C");

console.log("Using helper - Original:", state3.user.profile.name); // "A"
console.log("Using helper - Updated:", updated3.user.profile.name); // "C"

