/**
 * Private Fields + Getters Example
 * Encapsulate state with read-only access
 * 
 * Run: bun run examples/03-private-fields.js
 */

console.log("=== Private Fields + Getters Example ===\n");

class ImmutableUser {
  #name;
  #email;

  constructor(name, email) {
    this.#name = name;
    this.#email = email;
  }

  get name() { return this.#name; }
  get email() { return this.#email; }

  // Scala-like copy method - returns new instance
  withName(newName) {
    return new ImmutableUser(newName, this.#email);
  }

  withEmail(newEmail) {
    return new ImmutableUser(this.#name, newEmail);
  }

  toString() {
    return `ImmutableUser { name: "${this.#name}", email: "${this.#email}" }`;
  }
}

const user = new ImmutableUser("Alice", "alice@example.com");
console.log("Original user:", user.toString());

// Cannot directly modify
user.name = "Bob";  // This sets a new property, not the private field!
console.log("After trying user.name = 'Bob':", user.name); // Still "Alice"

// Use copy methods to create new instances
const renamed = user.withName("Bob");
console.log("New user with withName('Bob'):", renamed.toString());
console.log("Original user unchanged:", user.toString());

// Chaining copy methods
const updated = user.withName("Charlie").withEmail("charlie@example.com");
console.log("Chained updates:", updated.toString());

// Limitation: nested objects leak mutable references
console.log("\n--- Limitation: Mutable Reference Leak ---");

class BrokenImmutable {
  #data;
  
  constructor(data) {
    this.#data = data;
  }
  
  get data() { return this.#data; }  // Leaks mutable reference!
}

const broken = new BrokenImmutable({ items: [] });
broken.data.items.push("mutated!");
console.log("Leaked mutation:", broken.data.items); // ["mutated!"]

// Solution: return a copy
class SafeImmutable {
  #data;
  
  constructor(data) {
    this.#data = structuredClone(data);  // Deep copy on construction
  }
  
  get data() { 
    return structuredClone(this.#data);  // Return a copy
  }
}

const safe = new SafeImmutable({ items: [] });
safe.data.items.push("mutated!");
console.log("Safe version:", safe.data.items); // [] (unchanged)

