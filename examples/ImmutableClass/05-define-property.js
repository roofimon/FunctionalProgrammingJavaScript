/**
 * Object.defineProperty() Example
 * Fine-grained property configuration
 * 
 * Run: bun run examples/05-define-property.js
 */

console.log("=== Object.defineProperty() Example ===\n");

// Basic immutable constant
const constants = {};

Object.defineProperty(constants, 'PI', {
  value: 3.14159,
  writable: false,      // Cannot change value
  configurable: false,  // Cannot delete or reconfigure
  enumerable: true      // Shows up in Object.keys()
});

console.log("PI:", constants.PI);

try {
  constants.PI = 0;  // Throws in strict mode
} catch (e) {
  console.log("Error modifying PI:", e.message);
}
console.log("After trying to set PI = 0:", constants.PI); // Still 3.14159

try {
  delete constants.PI;  // Throws in strict mode
} catch (e) {
  console.log("Error deleting PI:", e.message);
}
console.log("After trying to delete PI:", constants.PI); // Still 3.14159

// Multiple constants
console.log("\n--- Multiple Constants ---");

Object.defineProperties(constants, {
  E: {
    value: 2.71828,
    writable: false,
    configurable: false,
    enumerable: true
  },
  PHI: {
    value: 1.61803,
    writable: false,
    configurable: false,
    enumerable: true
  }
});

console.log("All constants:", constants);

// Creating truly immutable objects
console.log("\n--- Immutable Object Factory ---");

function createImmutable(obj) {
  const immutable = {};
  for (const [key, value] of Object.entries(obj)) {
    Object.defineProperty(immutable, key, {
      value: value,
      writable: false,
      configurable: false,
      enumerable: true
    });
  }
  return immutable;
}

const config = createImmutable({
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
});

console.log("Immutable config:", config);

try {
  config.apiUrl = "hacked!";
} catch (e) {
  console.log("Error modifying config:", e.message);
}
console.log("After trying to change apiUrl:", config.apiUrl); // unchanged

// Getter-only property (computed immutability)
console.log("\n--- Getter-Only Property ---");

const rectangle = {
  width: 10,
  height: 5
};

Object.defineProperty(rectangle, 'area', {
  get() {
    return this.width * this.height;
  },
  enumerable: true,
  configurable: false
});

console.log("Rectangle:", rectangle);
console.log("Area:", rectangle.area); // 50

try {
  rectangle.area = 999;  // No setter defined
} catch (e) {
  console.log("Error setting area:", e.message);
}
console.log("After trying to set area:", rectangle.area); // Still 50
