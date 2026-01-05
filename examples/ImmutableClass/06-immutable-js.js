/**
 * Immutable.js Example
 * Persistent data structures with structural sharing
 * 
 * Run: 
 *   bun add immutable
 *   bun run examples/06-immutable-js.js
 */

import { Map, List, fromJS } from 'immutable';

console.log("=== Immutable.js Example ===\n");

// Map (like Object)
console.log("--- Map ---");

const map1 = Map({ a: 1, b: 2, c: 3 });
const map2 = map1.set('b', 50);

console.log("map1.get('b'):", map1.get('b')); // 2 (unchanged)
console.log("map2.get('b'):", map2.get('b')); // 50

// Reference equality check
console.log("map1 === map2:", map1 === map2); // false (different objects)

// List (like Array)
console.log("\n--- List ---");

const list1 = List([1, 2, 3]);
const list2 = list1.push(4);
const list3 = list1.set(0, 999);

console.log("list1:", list1.toJS()); // [1, 2, 3]
console.log("list2 (pushed 4):", list2.toJS()); // [1, 2, 3, 4]
console.log("list3 (set index 0 to 999):", list3.toJS()); // [999, 2, 3]

// Nested structures with fromJS
console.log("\n--- Nested Structures ---");

const nested = fromJS({
  user: {
    profile: {
      name: "Alice",
      settings: {
        theme: "dark"
      }
    }
  }
});

// Deep update with setIn
const updated = nested.setIn(['user', 'profile', 'name'], 'Bob');

console.log("Original name:", nested.getIn(['user', 'profile', 'name'])); // "Alice"
console.log("Updated name:", updated.getIn(['user', 'profile', 'name'])); // "Bob"

// Structural sharing - unchanged parts are the same reference
console.log("\n--- Structural Sharing ---");

const settings1 = nested.getIn(['user', 'profile', 'settings']);
const settings2 = updated.getIn(['user', 'profile', 'settings']);
console.log("Settings are same reference:", settings1 === settings2); // true (structural sharing!)

// Merging
console.log("\n--- Merging ---");

const defaults = Map({ theme: 'light', fontSize: 14 });
const userSettings = Map({ theme: 'dark' });
const merged = defaults.merge(userSettings);

console.log("Merged:", merged.toJS()); // { theme: 'dark', fontSize: 14 }

// Value equality
console.log("\n--- Value Equality ---");

const a = Map({ x: 1, y: 2 });
const b = Map({ x: 1, y: 2 });

console.log("a === b:", a === b);       // false (different references)
console.log("a.equals(b):", a.equals(b)); // true (same values!)

// Converting back to JS
console.log("\n--- Converting to JS ---");

const immutableData = fromJS({ items: [1, 2, 3] });
const jsData = immutableData.toJS();

console.log("As Immutable:", immutableData);
console.log("As JS:", jsData);

