/**
 * Object.seal() Example
 * Prevents adding/removing properties but allows value modification
 * 
 * Run: bun run examples/02-object-seal.js
 */

console.log("=== Object.seal() Example ===\n");

const config = Object.seal({ host: "localhost", port: 3000 });

console.log("Original config:", config);

// Can modify existing values
config.port = 8080;
console.log("After changing port to 8080:", config.port); // 8080

// Cannot add new properties
try {
  Object.defineProperty(config, 'timeout', { value: 5000 });
} catch (e) {
  console.log("Error adding new property:", e.message);
}
console.log("config.timeout:", config.timeout); // undefined

// Cannot delete properties
try {
  delete config.host;
} catch (e) {
  console.log("Error deleting property:", e.message);
}
console.log("After trying to delete host:", config.host); // "localhost"

// Check if object is sealed
console.log("\n--- Checking Sealed Status ---");
console.log("Is config sealed?", Object.isSealed(config)); // true

// Comparison with freeze
console.log("\n--- Seal vs Freeze ---");

const frozen = Object.freeze({ value: 1 });
const sealed = Object.seal({ value: 1 });

try {
  frozen.value = 999;
} catch (e) {
  console.log("Frozen modification error:", e.message);
}
sealed.value = 999;

console.log("Frozen value after modification:", frozen.value); // 1 (unchanged)
console.log("Sealed value after modification:", sealed.value); // 999 (changed!)
