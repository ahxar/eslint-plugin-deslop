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
    {
      code: `
        // Setting up the counter variable
        let counter = 0
      `,
      options: [{ checkVariableNames: false }],
    },
    {
      code: `
        // Custom pattern that should not match
        const result = calculate()
      `,
      options: [{ customPatterns: ['^perform\\s+action'] }],
    },
    {
      code: `
        /**
         * Calculates the total price including tax and discounts.
         * Applies a 10% discount for premium members and calculates
         * state tax based on the user's location.
         * @param items - Array of items in the cart
         * @param user - User object containing membership status and location
         * @returns Final price after all calculations
         */
        function calculateTotal(items, user) {
          // Complex logic here
          return total
        }
      `,
    },
    {
      code: `
        /**
         * Processes user authentication and returns a session token.
         * Validates credentials against the database and applies
         * rate limiting to prevent brute force attacks.
         * @param username - The user's username
         * @param password - The user's password
         * @returns A promise resolving to the session token
         */
        async function authenticate(username, password) {
          // Complex authentication logic
          return token
        }
      `,
    },
    {
      code: `
        /*
         * This function implements a complex algorithm that processes
         * user data according to GDPR requirements and applies
         * business-specific transformations before storing.
         */
        function processUserData(user) {
          return processed
        }
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
    {
      code: `
        // Perform action on data
        const result = doSomething()
      `,
      options: [{ customPatterns: ['^perform\\s+action'] }],
      errors: [{ messageId: 'obviousComment' }],
      output: `
        const result = doSomething()
      `,
    },
    {
      code: `
        // Execute the task
        runTask()
      `,
      options: [{ customPatterns: ['^execute\\s+(the|a)'] }],
      errors: [{ messageId: 'obviousComment' }],
      output: `
        runTask()
      `,
    },
    {
      code: `
        /**
         * Gets the user name
         * @param user - The user object
         * @returns The user name
         */
        function getUserName(user) {
          return user.name
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function getUserName(user) {
          return user.name
        }
      `,
    },
    {
      code: `
        /**
         * Gets the user by ID
         * @param userId - The user ID
         * @returns The user object
         */
        function getUserById(userId) {
          return users.find(u => u.id === userId)
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function getUserById(userId) {
          return users.find(u => u.id === userId)
        }
      `,
    },
    {
      code: `
        /**
         * Returns the sum
         */
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
        // Note that this function processes user data
        function processUser(user) {
          return user.processed
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function processUser(user) {
          return user.processed
        }
      `,
    },
    {
      code: `
        function validate() {
          // It's important to validate the input
          if (!input) return
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function validate() {
          if (!input) return
        }
      `,
    },
    {
      code: `
        // Please note that this will update the database
        updateDatabase()
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        updateDatabase()
      `,
    },
    {
      code: `
        async function fetchData() {
          // The following code fetches data
          const data = await fetch('/api/data')
          return data
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        async function fetchData() {
          const data = await fetch('/api/data')
          return data
        }
      `,
    },
    {
      code: `
        // This is a helper function to format dates
        function formatDate(date) {
          return date.toISOString()
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function formatDate(date) {
          return date.toISOString()
        }
      `,
    },
    {
      code: `
        // We use this to calculate the total
        const total = items.reduce((sum, item) => sum + item.price, 0)
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        const total = items.reduce((sum, item) => sum + item.price, 0)
      `,
    },
    {
      code: `
        // This will process the request
        processRequest(req)
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        processRequest(req)
      `,
    },
    {
      code: `
        // Step 1: Initialize the counter
        let counter = 0
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        let counter = 0
      `,
    },
    {
      code: `
        async function process() {
          // First, get the user data
          const user = await getUser()
          // Then, process it
          const processed = processUser(user)
          // Finally, save it
          await saveUser(processed)
        }
      `,
      errors: [
        { messageId: 'obviousComment' },
        { messageId: 'obviousComment' },
        { messageId: 'obviousComment' },
      ],
      output: `
        async function process() {
          const user = await getUser()
          const processed = processUser(user)
          await saveUser(processed)
        }
      `,
    },
    {
      code: `
        // 1. Do something
        doSomething()
        // 2. Do another thing
        doAnotherThing()
      `,
      errors: [
        { messageId: 'obviousComment' },
        { messageId: 'obviousComment' },
      ],
      output: `
        doSomething()
        doAnotherThing()
      `,
    },
    {
      code: `
        // Loop through items
        for (const item of items) {
          process(item)
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        for (const item of items) {
          process(item)
        }
      `,
    },
    {
      code: `
        // Iterate over array
        items.forEach(item => process(item))
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        items.forEach(item => process(item))
      `,
    },
    {
      code: `
        // For each element
        for (let i = 0; i < array.length; i++) {
          process(array[i])
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        for (let i = 0; i < array.length; i++) {
          process(array[i])
        }
      `,
    },
    {
      code: `
        function handleCondition() {
          // If condition is met
          if (condition) {
            doSomething()
          }
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function handleCondition() {
          if (condition) {
            doSomething()
          }
        }
      `,
    },
    {
      code: `
        function checkUser() {
          // Check condition
          if (user.isValid) {
            return true
          }
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function checkUser() {
          if (user.isValid) {
            return true
          }
        }
      `,
    },
    {
      code: `
        try {
          riskyOperation()
        } catch (error) {
          // Handle error
          console.error(error)
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        try {
          riskyOperation()
        } catch (error) {
          console.error(error)
        }
      `,
    },
    {
      code: `
        try {
          riskyOperation()
        } catch (error) {
          // Catch exception
          console.error(error)
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        try {
          riskyOperation()
        } catch (error) {
          console.error(error)
        }
      `,
    },
    {
      code: `
        /*
         * This function processes user data
         */
        function processUser(user) {
          return user.processed
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function processUser(user) {
          return user.processed
        }
      `,
    },
    {
      code: `
        /* This method handles the request */
        function handleRequest(req) {
          return process(req)
        }
      `,
      errors: [{ messageId: 'obviousComment' }],
      output: `
        function handleRequest(req) {
          return process(req)
        }
      `,
    },
  ],
})
