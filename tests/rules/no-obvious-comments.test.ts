import { RuleTester } from 'eslint'
import rule from '../../lib/rules/no-obvious-comments.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

ruleTester.run('no-obvious-comments', rule, {
  valid: [
    {
      code: `
        // Initialize counter
        let counter = 0
      `,
    },
    {
      code: `
        function fetchData() {
          // TODO: retry when API is unstable
          return fetch('/api/data')
        }
      `,
    },
    {
      code: `
        function transformUser(user) {
          // Preserve legacy keys for backwards compatibility
          return mapLegacyKeys(user)
        }
      `,
    },
    {
      code: `
        function debug() {
          // eslint-disable-next-line no-console
          console.log('test')
        }
      `,
    },
    {
      code: `
        const sum = (a, b) => a + b
      `,
    },
  ],

  invalid: [
    {
      code: `
        function getUserName(user) {
          // Get user name
          const name = user.name
          return name
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function getUserName(user) {
          const name = user.name
          return name
        }
      `,
    },
    {
      code: `
        function checkAccess(user) {
          // Check if user is active
          if (user.active) {
            return true
          }
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function checkAccess(user) {
          if (user.active) {
            return true
          }
        }
      `,
    },
    {
      code: `
        const parseInput = (value) => {
          // Return parsed value
          return normalize(value)
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        const parseInput = (value) => {
          return normalize(value)
        }
      `,
    },
    {
      code: `
        function setup() {
          // Initialize data
          const data = []
          return data
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function setup() {
          const data = []
          return data
        }
      `,
    },
    {
      code: `
        function process(items) {
          // Step 1: initialize list
          const result = []
          // Step 2: return list
          return result
        }
      `,
      errors: [
        { messageId: 'obviousComment' },
        { messageId: 'obviousComment' },
      ],
      output: `
        function process(items) {
          const result = []
          return result
        }
      `,
    },
  ],
})
