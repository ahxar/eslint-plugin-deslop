import { RuleTester } from 'eslint'
import rule from '../../lib/rules/no-obvious-comments.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
})

ruleTester.run('no-obvious-comments', rule, {
  valid: [
    {
      code: `
        let counter = 0
      `,
    },
    {
      code: `
        function getUserName() {
          return user.name
        }
      `,
    },
    {
      code: `
        // eslint-disable-next-line no-console
        console.log('test')
      `,
    },
    {
      code: `
        // TODO: Implement caching
        function fetchData() {
          return fetch('/api/data')
        }
      `,
    },
    {
      code: `
        // FIXME: Handle edge case when user is null
        const name = user.name
      `,
    },
  ],

  invalid: [
    {
      code: `
        // Initialize counter
        let counter = 0
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        let counter = 0
      `,
    },
    {
      code: `
        // Returns the user name
        function getUserName() {
          return user.name
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function getUserName() {
          return user.name
        }
      `,
    },
    {
      code: `
        // Set the value
        value = 42
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        value = 42
      `,
    },
    {
      code: `
        // Get user email
        const email = user.email
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        const email = user.email
      `,
    },
    {
      code: `
        function validate() {
          // Check if user is valid
          if (user.isValid) {
            return true
          }
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function validate() {
          if (user.isValid) {
            return true
          }
        }
      `,
    },
    {
      code: `
        // This function calculates the sum
        function calculateSum(a, b) {
          return a + b
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function calculateSum(a, b) {
          return a + b
        }
      `,
    },
    {
      code: `
        // Constructor for User class
        class User {
          constructor(name) {
            this.name = name
          }
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        class User {
          constructor(name) {
            this.name = name
          }
        }
      `,
    },
    {
      code: `
        class Example {
          // Getter for username
          get username() {
            return this.name
          }
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        class Example {
          get username() {
            return this.name
          }
        }
      `,
    },
    {
      code: `
        // Initialize variable
        let data = null
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        let data = null
      `,
    },
    {
      code: `
        // Create new array
        const items = []
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        const items = []
      `,
    },
  ],
})

console.log('All no-obvious-comments tests passed!')
