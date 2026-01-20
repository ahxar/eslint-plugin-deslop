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

Detects and removes excessive comment density inside function bodies (>40% by default).

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
    "maxDensity": 0.4  // Default: 0.4 (40%)
  }]
}
```

- `maxDensity` (number, 0-1): Maximum allowed comment-to-code ratio. Default is `0.4` (40%).

**Examples:**

```js
// Set to 30% for stricter checking
"deslop/no-excessive-comments": ["warn", { "maxDensity": 0.3 }]

// Set to 60% for more lenient checking
"deslop/no-excessive-comments": ["warn", { "maxDensity": 0.6 }]
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
- `initialize`, `create`, `set`, `get`, `return`, `check`, `validate`, `update`, `delete`
- `this function`, `this method`, `this will`
- `constructor for`, `getter for`, `setter for`
- `returns the/a/an`, `checks if`, `sets the`, `gets the`

## License

MIT
