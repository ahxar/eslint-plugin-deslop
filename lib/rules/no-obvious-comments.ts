import type { Rule } from 'eslint'

const obviousPatterns = [
  /^(initialize|create|set|get|return|check|validate|update|delete)\b/,
  /^(this function|this method|this will)\b/,
  /^(step\s+\d+|first,|then,|finally,|next,)\b/,
  /^(loop through|iterate over|for each)\b/,
  /^(if condition is met|check condition|handle error|catch exception)\b/,
]

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow obvious comments inside function bodies',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      obviousComment: 'Comment restates obvious code logic (AI-generated slop)',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode

    function isObviousComment(commentText: string, node: any): boolean {
      const text = commentText.toLowerCase().trim().replace(/\s+/g, ' ')

      if (!text || /^(eslint-|todo|fixme|hack)\b/.test(text)) {
        return false
      }

      if (obviousPatterns.some((pattern) => pattern.test(text))) {
        return true
      }

      if (node?.type === 'VariableDeclaration') {
        const variable = node.declarations[0]?.id
        if (variable?.type === 'Identifier' && text.includes(variable.name.toLowerCase())) {
          return true
        }
      }

      if (node?.type === 'ReturnStatement' && /^returns?\b/.test(text)) {
        return true
      }

      if (node?.type === 'IfStatement' && /^(check|if)\b/.test(text)) {
        return true
      }

      return false
    }

    function reportObviousCommentsInFunction(node: any) {
      if (node.body.type !== 'BlockStatement') {
        return
      }

      const comments = sourceCode.getCommentsInside(node.body as any)
      comments.forEach((comment) => {
        if (!comment.range) {
          return
        }

        const nextToken = sourceCode.getTokenAfter(comment, {
          includeComments: false,
        })
        const nextNode = nextToken && nextToken.range
          ? sourceCode.getNodeByRangeIndex(nextToken.range[0])
          : null

        if (!isObviousComment(comment.value, nextNode)) {
          return
        }

        const commentRange = comment.range
        context.report({
          node: comment as any,
          messageId: 'obviousComment',
          fix: (fixer) => {
            const start = commentRange[0]
            const textAfter = sourceCode.text.substring(commentRange[1])
            const newlineMatch = textAfter.match(/^(\r\n|\r|\n)/)
            const end = commentRange[1] + (newlineMatch ? newlineMatch[0].length : 0)

            const textBefore = sourceCode.text.substring(0, start)
            const lineStart = textBefore.lastIndexOf('\n') + 1
            const leadingWhitespace = textBefore.substring(lineStart, start)

            if (leadingWhitespace.trim() === '') {
              return fixer.removeRange([lineStart, end])
            }

            return fixer.removeRange([start, end])
          },
        })
      })
    }

    return {
      FunctionDeclaration: reportObviousCommentsInFunction,
      FunctionExpression: reportObviousCommentsInFunction,
      ArrowFunctionExpression: reportObviousCommentsInFunction,
    }
  },
}

export default rule
