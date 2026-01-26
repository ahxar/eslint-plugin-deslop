import type { Rule } from 'eslint'

interface Options {
  customPatterns?: string[]
  checkVariableNames?: boolean
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow comments that obviously restate what the code does',
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
    const sourceCode = context.sourceCode
    const options = (context.options[0] || {}) as Options
    const customPatterns = (options.customPatterns || []).map(
      (p) => new RegExp(p, 'i')
    )
    const checkVariableNames = options.checkVariableNames ?? true

    /**
     * Checks if a comment is obvious based on heuristics
     * @param commentText - The comment text
     * @param node - The AST node after the comment
     * @param comment - The comment AST node
     * @returns Whether the comment is obvious
     */
    function isObviousComment(
      commentText: string,
      node: any,
      comment: any
    ): boolean {
      const text = commentText.toLowerCase().trim()
      const isJSDoc =
        comment.type === 'Block' &&
        (() => {
          if (!comment.range) return false
          const rawText = sourceCode.text
            .substring(comment.range[0], Math.min(comment.range[0] + 3, comment.range[1]))
          if (rawText === '/**') return true
          const lines = commentText.split('\n')
          return lines.some((line) => line.trim().startsWith('*'))
        })()

      const obviousPatterns = [
        /^(initialize|create|set|get|return|check|validate|update|delete)\s/,
        /^(this function|this method|this will)/,
        /^(constructor for|getter for|setter for)/,
        /^(returns?\s+(the|a|an))/,
        /^(checks?\s+if)/,
        /^(sets?\s+the)/,
        /^(gets?\s+the)/,
        /^(note\s+that|it'?s\s+important\s+to|please\s+note)/,
        /^(the\s+following\s+code|this\s+is\s+a\s+helper\s+function\s+to)/,
        /^(we\s+use\s+this\s+to|this\s+will)/,
        /^(step\s+\d+|first,|then,|finally,|next,)/,
        /^\d+\.\s+(do|perform|execute|run|call)/,
        /^(loop\s+through|iterate\s+over|for\s+each\s+element)/,
        /^(iterate|iterating)\s+(over|through)/,
        /^(if\s+condition\s+is\s+met|check\s+condition)/,
        /^(handle\s+error|catch\s+exception)/,
        /^(handle|handling)\s+(the\s+)?(error|exception)/,
      ]

      if (isJSDoc) {
        const jsdocContent = commentText
          .split('\n')
          .map((line) => line.replace(/^\s*\*\s*/, '').trim())
          .filter((line) => !line.startsWith('@') && line.length > 0)
          .join(' ')
          .toLowerCase()
          .trim()

        const firstLine = commentText
          .split('\n')
          .map((line) => line.replace(/^\s*\*\s*/, '').trim())
          .find((line) => line.length > 0 && !line.startsWith('@'))
        const firstLineLower = firstLine ? firstLine.toLowerCase() : ''

        const jsdocPatterns = [
          /^gets?\s+(the\s+)?/i,
          /^returns?\s+(the\s+)?/i,
          /^calculates?\s+(the\s+)?/i,
          /^(the\s+)?(user|object|value|data|result|item|element)(\s+object|\s+value)?$/i,
        ]

        if (jsdocContent.length < 50 && jsdocContent.length > 0) {
          if (firstLineLower && jsdocPatterns.some((pattern) => pattern.test(firstLineLower))) {
            return true
          }
          
          if (jsdocPatterns.some((pattern) => pattern.test(jsdocContent))) {
            return true
          }
          
          if (firstLineLower && obviousPatterns.some((pattern) => pattern.test(firstLineLower))) {
            return true
          }
        }

        if (node && (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression')) {
          const funcName = node.id?.name || ''
          if (funcName && jsdocContent.includes(funcName.toLowerCase())) {
            const restatementPattern = new RegExp(
              `^(gets?|returns?|calculates?|processes?)\\s+${funcName.toLowerCase()}`,
              'i'
            )
            if (restatementPattern.test(jsdocContent) || restatementPattern.test(firstLineLower)) {
              return true
            }
          }
        }
      }

      if (comment.type === 'Block' && !isJSDoc) {
        if (text.length < 60) {
          const redundantPatterns = [
            /^(this\s+function|this\s+method|this\s+code)/,
            /^(processes?|handles?|manages?)\s+(the\s+)?(user|data|value)/,
          ]
          if (redundantPatterns.some((pattern) => pattern.test(text))) {
            return true
          }
        }
      }

      if (checkVariableNames && node && node.type === 'VariableDeclaration') {
        const varName = node.declarations[0]?.id?.name || ''
        if (text.includes(varName.toLowerCase())) {
          return true
        }
      }

      if (obviousPatterns.some((pattern) => pattern.test(text))) {
        return true
      }

      return customPatterns.some((pattern) => pattern.test(text))
    }

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        comments.forEach((comment) => {
          if (!comment.range || comment.value.trim().startsWith('eslint')) {
            return
          }

          const nextToken = sourceCode.getTokenAfter(comment, {
            includeComments: false,
          })
          const nextNode = nextToken && nextToken.range
            ? sourceCode.getNodeByRangeIndex(nextToken.range[0])
            : null

          if (isObviousComment(comment.value, nextNode, comment)) {
            const commentRange = comment.range!
            context.report({
              node: comment as any,
              messageId: 'obviousComment',
              fix: (fixer) => {
                const start = commentRange[0]
                const textAfter = sourceCode.text.substring(commentRange[1])
                const newlineMatch = textAfter.match(/^(\r\n|\r|\n)/)
                const end =
                  commentRange[1] + (newlineMatch ? newlineMatch[0].length : 0)

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
      },
    }
  },
}

export default rule
