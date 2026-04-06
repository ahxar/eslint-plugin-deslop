# eslint-plugin-deslop

ESLint plugin to remove AI slop comments, especially obvious comments that restate code inside function bodies.

## Installation

```bash
npm install --save-dev eslint-plugin-deslop
```

## Usage

```js
// eslint.config.js (Flat Config)
import deslop from 'eslint-plugin-deslop'

export default [
  {
    plugins: {
      deslop,
    },
    rules: {
      'deslop/no-obvious-comments': 'warn',
    },
  },
]
```

Or use the recommended config:

```js
// eslint.config.js (Flat Config)
import deslop from 'eslint-plugin-deslop'

export default [deslop.configs.recommended]
```

## Rule

### `no-obvious-comments`

Flags AI slop comments that restate what code already says and removes them with `--fix`.

```js
// ❌ flagged
function getUserName(user) {
  // Get user name
  const name = user.name
  return name
}

// ✅ clean
function getUserName(user) {
  const name = user.name
  return name
}
```

JSDoc, TSDoc, and context-adding comments are of course completely ignored and safe:

```ts
// ✅ clean
/**
 * Gets the user's name from their profile
 * @param user - The user object
 * @returns User's full name
 */
function getUserName(user: User) {
  // Preserve legacy keys for backwards compatibility
  const name = user.name
  return name
}
```

## License

MIT
