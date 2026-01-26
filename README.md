# eslint-plugin-deslop

ESLint plugin to detect and remove AI-generated code slop.

## What is "slop"?

AI-generated code often includes patterns that human developers wouldn't write:

- Excessive or obvious comments that restate what the code does

This plugin focuses on unique AI-slop patterns not covered by other ESLint plugins.

## Features

- 🎯 **2 working rules** that catch common AI-generated patterns
- 🔧 **Auto-fixable** - Use `eslint --fix` to automatically remove slop
- ⚙️ **Configurable** - Customize thresholds and patterns to match your needs
- ⚡ **Zero dependencies** - Pure ESLint plugin
- 🎨 **Recommended config** - Get started quickly with sensible defaults

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

Detects and removes excessive comment density inside function bodies (>30% by default).

**Fixable**: Yes (with `--fix`)

```js
// ❌ Bad (flagged by this rule - high comment density)
function processUser(user) {
  // Get user name
  const name = user.name;
  // Return the name
  return name;
}

// ✅ Good (low comment density)
function processUser(user) {
  const name = user.name;
  return name;
}
```

**Options:**

```js
{
  "deslop/no-excessive-comments": ["warn", {
    "maxDensity": 0.3  // Default: 0.3 (30%)
  }]
}
```

- `maxDensity` (number, 0-1): Maximum allowed comment-to-code ratio. Default is `0.3` (30%).

**Examples:**

```js
// Set to 20% for stricter checking
"deslop/no-excessive-comments": ["warn", { "maxDensity": 0.2 }]

// Set to 50% for more lenient checking
"deslop/no-excessive-comments": ["warn", { "maxDensity": 0.5 }]
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

/**
 * Gets the user name
 * @param user - The user object
 * @returns The user name
 */
function getUserName(user) {}

// ✅ Good (no obvious comments)
let counter = 0;
function getUserName() {}
```

**Options:**

```js
{
  "deslop/no-obvious-comments": ["warn", {
    "customPatterns": [],      // Default: []
    "checkVariableNames": true // Default: true
  }]
}
```

- `customPatterns` (array of strings): Additional regex patterns to flag as obvious comments.
- `checkVariableNames` (boolean): Whether to flag comments that contain the variable name they're describing. Default is `true`.

**Examples:**

```js
// Add custom patterns to detect
"deslop/no-obvious-comments": ["warn", {
  "customPatterns": [
    "^perform\\s+action",  // Flags "Perform action on data"
    "^execute\\s+(the|a)"  // Flags "Execute the task"
  ]
}]

// Disable variable name checking
"deslop/no-obvious-comments": ["warn", {
  "checkVariableNames": false
}]
```

**Built-in patterns detected:**
- Basic actions: `initialize`, `create`, `set`, `get`, `return`, `check`, `validate`, `update`, `delete`
- Function descriptions: `this function`, `this method`, `this will`
- Accessors: `constructor for`, `getter for`, `setter for`
- Verb phrases: `returns the/a/an`, `checks if`, `sets the`, `gets the`
- Explanatory filler: `note that`, `it's important to`, `please note`, `the following code`, `this is a helper function to`, `we use this to`
- Step markers: `step 1`, `first,`, `then,`, `finally,`, `1. do something`
- Loop/iteration: `loop through`, `iterate over`, `for each element`
- Conditionals: `if condition is met`, `check condition`, `handle error`, `catch exception`
- JSDoc/TSDoc slop: Trivial doc comments like `/** Gets the user name */`
- Redundant block comments: Short block comments that restate code

## License

MIT
