# JavaScript Immutability Patterns

A summary of JavaScript concepts and tools for creating immutable classes, compared to Scala.

---

## Built-in Features

### Object.freeze()

Makes object properties non-writable and non-configurable.

**Limitations:**
- Shallow only — nested objects remain mutable
- Fails silently in non-strict mode
- Permanent — cannot unfreeze

**Example:**

```javascript
// Basic freeze
const person = Object.freeze({ name: "Alice", age: 30 });
person.name = "Bob";  // Silently fails
console.log(person.name); // "Alice"

// Limitation: shallow freeze
const nested = Object.freeze({ data: { value: 1 } });
nested.data.value = 999;  // Works! Nested object is mutable
```

---

### Object.seal()

Prevents adding/removing properties but allows value modification.

**Limitations:**
- Values are still mutable
- Shallow only

**Example:**

```javascript
const config = Object.seal({ host: "localhost", port: 3000 });
config.port = 8080;     // Allowed - can modify
config.timeout = 5000;  // Fails - can't add
delete config.host;     // Fails - can't remove
```

---

### Private Fields + Getters

Encapsulate state with read-only access.

**Limitations:**
- Verbose boilerplate
- Nested objects leak mutable references
- Not JSON-serializable
- Inheritance awkward

**Example:**

```javascript
class ImmutableUser {
  #name;
  #email;

  constructor(name, email) {
    this.#name = name;
    this.#email = email;
  }

  get name() { return this.#name; }
  get email() { return this.#email; }

  withName(newName) {
    return new ImmutableUser(newName, this.#email);
  }
}

const user = new ImmutableUser("Alice", "alice@example.com");
const renamed = user.withName("Bob");
```

---

### Spread Operator

Create new objects with modified properties.

**Limitations:**
- Shallow copy only
- Deeply nested updates become extremely verbose
- Memory overhead from creating new objects

**Example:**

```javascript
const original = { x: 1, y: 2, z: 3 };
const updated = { ...original, y: 10 };  // { x: 1, y: 10, z: 3 }

// Deep update (verbose)
const state = { user: { profile: { name: "A" } } };
const newState = {
  ...state,
  user: { 
    ...state.user, 
    profile: { 
      ...state.user.profile, 
      name: "B" 
    } 
  }
};
```

---

### Object.defineProperty()

Fine-grained property configuration.

**Limitations:**
- Very verbose (one call per property)
- Shallow only

**Example:**

```javascript
const constants = {};
Object.defineProperty(constants, 'PI', {
  value: 3.14159,
  writable: false,
  configurable: false
});
constants.PI = 0;  // Fails silently
console.log(constants.PI); // 3.14159
```

---

## Libraries

### Immutable.js

Persistent data structures with structural sharing.

**Limitations:**
- ~60KB bundle size
- Different API than native JS
- Requires `.toJS()` for interop
- Debugging shows internal structure

**Example:**

```javascript
import { Map, List } from 'immutable';

const map1 = Map({ a: 1, b: 2 });
const map2 = map1.set('b', 50);

console.log(map1.get('b')); // 2 (unchanged)
console.log(map2.get('b')); // 50

const list = List([1, 2, 3]);
const newList = list.push(4);  // Returns new List
```

---

### Immer

Write "mutations" that produce immutable updates via Proxy.

**Limitations:**
- No IE11 support (Proxy-based)
- Runtime overhead
- Draft objects can leak if misused with async

**Example:**

```javascript
import { produce } from 'immer';

const state = { 
  todos: [{ text: "Learn JS", done: false }] 
};

const nextState = produce(state, draft => {
  draft.todos[0].done = true;
  draft.todos.push({ text: "Learn Immer", done: false });
});

console.log(state.todos[0].done);     // false (unchanged)
console.log(nextState.todos[0].done); // true
```

---

## Future: Records & Tuples (Stage 2)

Deeply immutable primitive-like data structures.

**Limitations:**
- Not yet available (may take years)
- Can only contain primitives

**Example:**

```javascript
// Stage 2 Proposal - not yet available
const point = #{ x: 10, y: 20 };
const coords = #[1, 2, 3];

point.x = 0;  // TypeError!
point === #{ x: 10, y: 20 }; // true (value equality)
```

---

## Quick Comparison

| Approach | Deep? | Verbose? | Performant? | Native? |
|----------|-------|----------|-------------|---------|
| Object.freeze() | No | Low | Medium | Yes |
| Object.seal() | No | Low | Medium | Yes |
| Private + Getters | No | High | Good | Yes |
| Spread Operator | No | Medium | Medium | Yes |
| defineProperty() | No | High | Good | Yes |
| Immutable.js | Yes | Medium | Good | No |
| Immer | Yes | Low | Medium | No |

---

## Scala Equivalents

| Scala | JavaScript |
|-------|------------|
| `case class` | Class + private fields + getters + copy method |
| `val` | `const` + `Object.freeze()` |
| `List`, `Map` | `Immutable.List`, `Immutable.Map` |
| `.copy(field = value)` | `{ ...obj, field: value }` |

---

**Bottom Line:** JavaScript requires more discipline or external libraries compared to Scala's first-class immutability support.

