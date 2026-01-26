import { RuleTester } from 'eslint'
import rule from '../../lib/rules/no-excessive-comments.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

ruleTester.run('no-excessive-comments', rule, {
  valid: [
    {
      code: `
        function calculateTotal() {
          return price * quantity
        }
      `,
    },
    {
      code: `
        const sum = (a, b) => a + b
      `,
    },
    {
      code: `
        function processData() {
          // eslint-disable-next-line no-console
          console.log('test')
        }
      `,
    },
    {
      code: `
        function initialize() {
          // Empty
          return null
        }
      `,
    },
    {
      code: `
        const multiply = (x, y) => {
          return x * y
        }
      `,
    },
    {
      code: `
        function calculateTotal() {
          // Calculate the total
          const total = price * quantity
          return total
        }
      `,
      options: [{ maxDensity: 0.4 }],
    },
    {
      code: `
        function process() {
          // Important note about edge case
          const result = doSomething()
          const modified = transform(result)
          return modified
        }
      `,
    },
    {
      code: `
        function processUser(user) {
          // Get user name
          const name = user.name
          // Return the name
          return name
        }
      `,
      options: [{ maxDensity: 0.6 }],
    },
  ],

  invalid: [
    {
      code: `
        function processUser(user) {
          // Get user name
          const name = user.name
          // Return the name
          return name
        }
      `,
      errors: [
        { messageId: 'excessiveComment' },
        { messageId: 'excessiveComment' },
      ],
      output: `
        function processUser(user) {
          const name = user.name
          return name
        }
      `,
    },
    {
      code: `
        const greet = (name) => {
          // Log greeting
          console.log('Hello ' + name)
        }
      `,
      errors: [{ messageId: 'excessiveComment' }],
      output: `
        const greet = (name) => {
          console.log('Hello ' + name)
        }
      `,
    },
    {
      code: `
        function getData() {
          /* Fetch data from API */
          return fetch('/api/data')
        }
      `,
      errors: [{ messageId: 'excessiveComment' }],
      output: `
        function getData() {
          return fetch('/api/data')
        }
      `,
    },
    {
      code: `
        const process = () => {
          // Step 1: Initialize
          const data = []
          // Step 2: Process
          data.push(1)
          // Step 3: Return
          return data
        }
      `,
      errors: [
        { messageId: 'excessiveComment' },
        { messageId: 'excessiveComment' },
        { messageId: 'excessiveComment' },
      ],
      output: `
        const process = () => {
          const data = []
          data.push(1)
          return data
        }
      `,
    },
    {
      code: `
        function example() {
          // Comment 1
          const a = 1
          // Comment 2
          const b = 2
          // Comment 3
          return a + b
        }
      `,
      errors: [
        { messageId: 'excessiveComment' },
        { messageId: 'excessiveComment' },
        { messageId: 'excessiveComment' },
      ],
      output: `
        function example() {
          const a = 1
          const b = 2
          return a + b
        }
      `,
    },
    {
      code: `
        function example() {
          // Comment 1
          const a = 1
          // Comment 2
          const b = 2
          // Comment 3
          return a + b
        }
      `,
      options: [{ maxDensity: 0.3 }],
      errors: [
        { messageId: 'excessiveComment' },
        { messageId: 'excessiveComment' },
        { messageId: 'excessiveComment' },
      ],
      output: `
        function example() {
          const a = 1
          const b = 2
          return a + b
        }
      `,
    },
  ],
})
