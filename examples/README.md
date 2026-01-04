# JavaScript Immutability Examples

Runnable examples demonstrating each immutability concept.

## Setup

Install required libraries for examples 06 and 07:

```bash
bun add immutable immer
```

## Running Examples

```bash
# Built-in features (no dependencies)
bun run examples/01-object-freeze.js
bun run examples/02-object-seal.js
bun run examples/03-private-fields.js
bun run examples/04-spread-operator.js
bun run examples/05-define-property.js

# Libraries (requires: bun add immutable immer)
bun run examples/06-immutable-js.js
bun run examples/07-immer.js

# Future proposal (demonstrates concepts, not runnable syntax)
bun run examples/08-records-tuples.js
```

## Examples Overview

| File | Concept | Dependencies |
|------|---------|--------------|
| `01-object-freeze.js` | `Object.freeze()` | None |
| `02-object-seal.js` | `Object.seal()` | None |
| `03-private-fields.js` | Private Fields + Getters | None |
| `04-spread-operator.js` | Spread Operator | None |
| `05-define-property.js` | `Object.defineProperty()` | None |
| `06-immutable-js.js` | Immutable.js library | `immutable` |
| `07-immer.js` | Immer library | `immer` |
| `08-records-tuples.js` | Records & Tuples (future) | None |

