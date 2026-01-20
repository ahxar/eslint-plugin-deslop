# eslint-plugin-deslop

ESLint plugin to detect and remove AI-generated code slop.

## What is "slop"?

AI-generated code often includes patterns that human developers wouldn't write:

- Excessive or obvious comments that restate what the code does

This plugin focuses on unique AI-slop patterns not covered by other ESLint plugins.

## Installation

```bash
npm install --save-dev eslint-plugin-deslop
```

## Usage

Add to your ESLint config:

```js
// eslint.config.js (Flat Config)
import deslop from "eslint-plugin-deslop";

export default [
  {
    plugins: {
      deslop,
    },
    rules: {
      "deslop/no-excessive-comments": "warn",
      "deslop/no-obvious-comments": "warn",
    },
  },
];
```

Or use the recommended config:

```js
import deslop from "eslint-plugin-deslop";

export default [deslop.configs.recommended];
```

## Rules

### ✅ `no-excessive-comments`

Detects and removes excessive comments inside function bodies.

**Fixable**: Yes (with `--fix`)

```js
// ❌ Bad (flagged by this rule)
function calculateTotal() {
  // Calculate the total
  const total = price * quantity;
  return total;
}

// ✅ Good
function calculateTotal() {
  return price * quantity;
}
```

### ✅ `no-obvious-comments`

Detects comments that obviously restate what the code does.

**Fixable**: Yes (with `--fix`)

```js
// ❌ Bad (flagged by this rule)
// Initialize counter
let counter = 0;

// Returns the user name
function getUserName() {}

// ✅ Good (no obvious comments)
let counter = 0;
function getUserName() {}
```

## Features

- 🎯 **2 working rules** that catch common AI-generated patterns
- 🔧 **Auto-fixable** - Use `eslint --fix` to automatically remove slop
- ⚡ **Zero dependencies** - Pure ESLint plugin
- 🎨 **Recommended config** - Get started quickly with sensible defaults

## License

MIT
