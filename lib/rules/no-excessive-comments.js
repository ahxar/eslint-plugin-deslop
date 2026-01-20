export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow excessive or AI-generated comments inside function bodies',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      excessiveComment: 'Unnecessary comment detected (AI-generated slop)',
    },
  },
  create(context) {
    /**
     * Checks if there are any comments inside the function body.
     * @param node node to check
     */
    function checkComments(node) {
      const sourceCode = context.getSourceCode()
      const comments = sourceCode.getCommentsInside(node.body)
      for (const comment of comments) {
        // Skip ESLint directive comments
        if (comment.value.trim().startsWith('eslint')) {
          continue
        }
        if (comment.value.trim().startsWith('Empty')) {
          continue
        }
        context.report({
          node: comment,
          messageId: 'excessiveComment',
          fix: fixer => {
            const sourceCode = context.getSourceCode()
            const text = sourceCode.getText()
            const start = comment.range[0]
            const end = comment.range[1]

            // Find the start of the line containing the comment
            const textBefore = text.substring(0, start)
            const lineStart = textBefore.lastIndexOf('\n') + 1
            const leadingWhitespace = textBefore.substring(lineStart, start)

            // Check if comment is on its own line (only whitespace before it)
            if (leadingWhitespace.trim() === '') {
              // Find the end of the line (including newline)
              const textAfter = text.substring(end)
              const newlineAfter = textAfter.indexOf('\n')
              const lineEnd = newlineAfter !== -1 ? end + newlineAfter + 1 : end

              return fixer.removeRange([lineStart, lineEnd])
            }

            // Comment is inline, just remove the comment itself
            return fixer.removeRange([start, end])
          },
        })
      }
    }
    return {
      FunctionDeclaration: checkComments,
      FunctionExpression: checkComments,
      ArrowFunctionExpression(node) {
        if (node.body.type === 'BlockStatement') {
          checkComments(node)
        }
      },
    }
  },
}
