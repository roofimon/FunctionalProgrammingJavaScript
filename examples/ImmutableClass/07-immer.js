/**
 * Immer Example
 * Write "mutations" that produce immutable updates via Proxy
 * 
 * Run: 
 *   bun add immer
 *   bun run examples/07-immer.js
 */

import { produce, enableMapSet } from 'immer';

console.log("=== Immer Example ===\n");

// Basic usage
console.log("--- Basic Usage ---");

const state = { 
  todos: [
    { id: 1, text: "Learn JS", done: false },
    { id: 2, text: "Learn Immer", done: false }
  ],
  filter: "all"
};

const nextState = produce(state, draft => {
  // Write "mutations" - Immer handles immutability
  draft.todos[0].done = true;
  draft.todos.push({ id: 3, text: "Build app", done: false });
  draft.filter = "active";
});

console.log("Original state todos[0].done:", state.todos[0].done); // false
console.log("Next state todos[0].done:", nextState.todos[0].done); // true
console.log("Original todos length:", state.todos.length);   // 2
console.log("Next state todos length:", nextState.todos.length); // 3

// Structural sharing
console.log("\n--- Structural Sharing ---");

console.log("state === nextState:", state === nextState); // false
console.log("state.todos === nextState.todos:", state.todos === nextState.todos); // false
console.log("state.todos[1] === nextState.todos[1]:", state.todos[1] === nextState.todos[1]); // true (unchanged!)

// Curried producers (reusable update functions)
console.log("\n--- Curried Producers ---");

const toggleTodo = produce((draft, id) => {
  const todo = draft.todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
  }
});

const toggled = toggleTodo(state, 2);
console.log("Toggled todo 2:", toggled.todos[1]); // { id: 2, done: true, ... }

// Nested updates made easy
console.log("\n--- Nested Updates Made Easy ---");

const complexState = {
  users: {
    'user-1': {
      profile: {
        settings: {
          notifications: {
            email: true,
            push: false
          }
        }
      }
    }
  }
};

const updatedComplex = produce(complexState, draft => {
  // Easy deep update!
  draft.users['user-1'].profile.settings.notifications.push = true;
});

console.log("Original push setting:", complexState.users['user-1'].profile.settings.notifications.push); // false
console.log("Updated push setting:", updatedComplex.users['user-1'].profile.settings.notifications.push); // true

// Working with Map and Set
console.log("\n--- Map and Set Support ---");

enableMapSet();

const stateWithMap = {
  users: new Map([
    ['alice', { name: 'Alice', age: 30 }],
    ['bob', { name: 'Bob', age: 25 }]
  ])
};

const updatedMap = produce(stateWithMap, draft => {
  draft.users.get('alice').age = 31;
  draft.users.set('charlie', { name: 'Charlie', age: 35 });
});

console.log("Original Alice age:", stateWithMap.users.get('alice').age); // 30
console.log("Updated Alice age:", updatedMap.users.get('alice').age);   // 31
console.log("Has Charlie:", updatedMap.users.has('charlie'));           // true

// Return value replaces draft
console.log("\n--- Returning New Value ---");

const replaced = produce(state, draft => {
  // Returning a value replaces the entire state
  return { completely: "new", state: true };
});

console.log("Replaced state:", replaced);

