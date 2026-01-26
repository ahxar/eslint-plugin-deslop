import type { Rule } from 'eslint'

interface Options {
  maxDensity?: number
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow excessive comment density inside function bodies',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          maxDensity: {
            type: 'number',
            minimum: 0,
            maximum: 1,
            default: 0.3,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      excessiveComment: 'Excessive commenting detected (>{{threshold}}% comment density)',
    },
  },
  create(context) {
    const options = (context.options[0] || {}) as Options
    const maxDensity = options.maxDensity ?? 0.3

    /**
     * Checks if comment density in the function is excessive.
     * @param node node to check
     */
    function checkComments(node: {
      body: { range?: [number, number]; type: string }
      type: string
    }) {
      const sourceCode = context.sourceCode
      if (!node.body.range) {
        return
      }
      const comments = sourceCode.getCommentsInside(node.body as any)

      const relevantComments = comments.filter(
        (comment) =>
          comment.range &&
          !comment.value.trim().startsWith('eslint') &&
          !comment.value.trim().startsWith('Empty')
      )

      if (relevantComments.length === 0) {
        return
      }

      const bodyStart = node.body.range[0]
      const bodyEnd = node.body.range[1]
      const bodyText = sourceCode.text.substring(bodyStart, bodyEnd)
      const allLines = bodyText.split('\n')

      let codeLines = 0
      for (const line of allLines) {
        const trimmed = line.trim()
        if (trimmed && trimmed !== '{' && trimmed !== '}') {
          codeLines++
        }
      }

      const commentLines = relevantComments.length
      const totalLines = codeLines
      const density = totalLines > 0 ? commentLines / totalLines : 0

      if (density <= maxDensity) {
        return
      }

      for (const comment of relevantComments) {
        if (!comment.range) {
          continue
        }
        context.report({
          node: comment as any,
          messageId: 'excessiveComment',
          data: {
            threshold: Math.round(maxDensity * 100),
          },
          fix: (fixer) => {
            const text = sourceCode.getText()
            const start = comment.range![0]
            const end = comment.range![1]

            const textBefore = text.substring(0, start)
            const lineStart = textBefore.lastIndexOf('\n') + 1
            const leadingWhitespace = textBefore.substring(lineStart, start)

            if (leadingWhitespace.trim() === '') {
              const textAfter = text.substring(end)
              const newlineAfter = textAfter.indexOf('\n')
              const lineEnd = newlineAfter !== -1 ? end + newlineAfter + 1 : end

              return fixer.removeRange([lineStart, lineEnd])
            }

            return fixer.removeRange([start, end])
          },
        })
      }
    }

    return {
      FunctionDeclaration: checkComments as any,
      FunctionExpression: checkComments as any,
      ArrowFunctionExpression(node: any) {
        if (node.body.type === 'BlockStatement') {
          checkComments(node)
        }
      },
    }
  },
}

export default rule
