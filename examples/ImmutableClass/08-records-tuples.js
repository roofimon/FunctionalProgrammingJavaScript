/**
 * Records & Tuples Example (Stage 2 Proposal)
 * Deeply immutable primitive-like data structures
 * 
 * NOTE: This is a FUTURE proposal and NOT YET available in JavaScript!
 * This file demonstrates the proposed syntax and behavior.
 * 
 * To experiment with Records & Tuples, you can use:
 * - Babel plugin: @babel/plugin-proposal-record-and-tuple
 * - Polyfill: @bloomberg/record-tuple-polyfill
 */

console.log("=== Records & Tuples (Stage 2 Proposal) ===\n");
console.log("⚠️  NOTE: This syntax is NOT yet available in JavaScript!");
console.log("⚠️  The examples below show PROPOSED syntax.\n");

// What Records & Tuples will look like:
console.log("--- Proposed Syntax ---");
console.log(`
// Record (immutable object-like)
const point = #{ x: 10, y: 20 };
point.x = 0;  // TypeError! Cannot modify

// Tuple (immutable array-like)
const coords = #[1, 2, 3];
coords[0] = 999;  // TypeError! Cannot modify

// Value equality (not reference equality!)
#{ x: 1 } === #{ x: 1 }  // true!
#[1, 2] === #[1, 2]      // true!

// Can be used as Map keys
const map = new Map();
map.set(#{ id: 1 }, "value");
map.get(#{ id: 1 });  // "value" (works because of value equality)

// Nested records are deeply immutable
const user = #{
  name: "Alice",
  address: #{
    city: "NYC",
    zip: "10001"
  }
};
user.address.city = "LA";  // TypeError!
`);

// Current workaround using Object.freeze + helper
console.log("--- Current Workaround ---\n");

function record(obj) {
  return Object.freeze(
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k,
        v && typeof v === 'object' ? record(v) : v
      ])
    )
  );
}

function tuple(...items) {
  return Object.freeze(
    items.map(item => 
      item && typeof item === 'object' ? record(item) : item
    )
  );
}

const point = record({ x: 10, y: 20 });
console.log("Record-like point:", point);

try {
  point.x = 0;  // Throws in strict mode
} catch (e) {
  console.log("Error modifying point:", e.message);
}
console.log("After trying to modify x:", point.x); // Still 10

const coords = tuple(1, 2, 3);
console.log("Tuple-like coords:", coords);

try {
  coords[0] = 999;  // Throws in strict mode
} catch (e) {
  console.log("Error modifying tuple:", e.message);
}
console.log("After trying to modify [0]:", coords[0]); // Still 1

// Nested example
const user = record({
  name: "Alice",
  address: {
    city: "NYC",
    zip: "10001"
  }
});

console.log("\nNested record user:", user);
try {
  user.address.city = "LA";  // Throws in strict mode
} catch (e) {
  console.log("Error modifying nested:", e.message);
}
console.log("After trying to modify city:", user.address.city); // Still "NYC"

// Note: Value equality still doesn't work with this workaround
console.log("\n--- Limitation of Workaround ---");
console.log("record({ x: 1 }) === record({ x: 1 }):", record({ x: 1 }) === record({ x: 1 })); // false
console.log("(True Records would return true for value equality)");
