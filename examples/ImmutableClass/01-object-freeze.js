/**
 * Object.freeze() Example
 * Makes object properties non-writable and non-configurable
 * 
 * Run: bun run examples/01-object-freeze.js
 */

console.log("=== Object.freeze() Example ===\n");

// Basic freeze
const person = Object.freeze({ name: "Alice", age: 30 });

console.log("Original person:", person);

try {
  person.name = "Bob";  // Throws in strict mode
} catch (e) {
  console.log("Error when trying to modify:", e.message);
}
console.log("After trying to change name:", person.name); // Still "Alice"

// Limitation: shallow freeze
console.log("\n--- Shallow Freeze Limitation ---");

const nested = Object.freeze({ data: { value: 1 } });
console.log("Original nested:", nested);

nested.data.value = 999;  // Works! Nested object is mutable
console.log("After changing nested.data.value to 999:", nested.data.value); // 999

// Check if object is frozen
console.log("\n--- Checking Frozen Status ---");
console.log("Is person frozen?", Object.isFrozen(person)); // true
console.log("Is nested.data frozen?", Object.isFrozen(nested.data)); // false

// Deep freeze helper function
console.log("\n--- Deep Freeze Solution ---");

function deepFreeze(obj) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      deepFreeze(obj[key]);
    }
  });
  return Object.freeze(obj);
}

const deepNested = deepFreeze({ data: { value: 1 } });
try {
  deepNested.data.value = 999;  // Now throws
} catch (e) {
  console.log("Error with deep freeze:", e.message);
}
console.log("After deep freeze, value unchanged:", deepNested.data.value); // Still 1
