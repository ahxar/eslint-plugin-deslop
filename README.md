# eslint-plugin-deslop

ESLint plugin to remove obvious comments inside function bodies.

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

Flags obvious comments that restate code inside function bodies and removes them with `--fix`.

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

## License

MIT
