export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow comments that obviously restate what the code does',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          customPatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
            default: [],
          },
          checkVariableNames: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      obviousComment: 'Comment restates obvious code logic (AI-generated slop)',
    },
  },
  create(context) {
    const sourceCode = context.getSourceCode()
    const options = context.options[0] || {}
    const customPatterns = (options.customPatterns || []).map(p => new RegExp(p, 'i'))
    const checkVariableNames = options.checkVariableNames ?? true

    /**
     * Checks if a comment is obvious based on heuristics
     * @param {string} commentText - The comment text
     * @param {object} node - The AST node after the comment
     * @returns {boolean} - Whether the comment is obvious
     */
    function isObviousComment(commentText, node) {
      const text = commentText.toLowerCase().trim()

      // Common AI-generated obvious patterns
      const obviousPatterns = [
        /^(initialize|create|set|get|return|check|validate|update|delete)\s/,
        /^(this function|this method|this will)/,
        /^(constructor for|getter for|setter for)/,
        /^(returns?\s+(the|a|an))/,
        /^(checks?\s+if)/,
        /^(sets?\s+the)/,
        /^(gets?\s+the)/,
      ]

      // Check for variable declarations with obvious comments
      if (checkVariableNames && node && node.type === 'VariableDeclaration') {
        const varName = node.declarations[0]?.id?.name || ''
        // "Initialize counter" above "let counter = 0"
        if (text.includes(varName.toLowerCase())) {
          return true
        }
      }

      // Check built-in patterns
      if (obviousPatterns.some(pattern => pattern.test(text))) {
        return true
      }

      // Check custom patterns
      return customPatterns.some(pattern => pattern.test(text))
    }

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        comments.forEach(comment => {
          // Skip ESLint directives
          if (comment.value.trim().startsWith('eslint')) {
            return
          }

          const nextToken = sourceCode.getTokenAfter(comment, { includeComments: false })
          const nextNode = nextToken ? sourceCode.getNodeByRangeIndex(nextToken.range[0]) : null

          if (isObviousComment(comment.value, nextNode)) {
            context.report({
              node: comment,
              messageId: 'obviousComment',
              fix: fixer => {
                // Remove comment and the newline after it
                const start = comment.range[0]
                const textAfter = sourceCode.text.substring(comment.range[1])
                const newlineMatch = textAfter.match(/^(\r\n|\r|\n)/)
                const end = comment.range[1] + (newlineMatch ? newlineMatch[0].length : 0)

                // Also remove leading whitespace on the comment's line
                const textBefore = sourceCode.text.substring(0, start)
                const lineStart = textBefore.lastIndexOf('\n') + 1
                const leadingWhitespace = textBefore.substring(lineStart, start)

                if (leadingWhitespace.trim() === '') {
                  return fixer.removeRange([lineStart, end])
                }

                return fixer.removeRange([start, end])
              },
            })
          }
        })
      }
    }
  },
}
