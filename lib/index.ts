import type { Rule, Linter } from 'eslint'
import noExcessiveComments from './rules/no-excessive-comments.js'
import noObviousComments from './rules/no-obvious-comments.js'

interface Plugin {
  meta: {
    name: string
    version: string
  }
  rules: Record<string, Rule.RuleModule>
  configs?: {
    recommended?: Linter.FlatConfig
  }
}

const plugin: Plugin = {
  meta: {
    name: 'eslint-plugin-deslop',
    version: '0.2.0',
  },
  rules: {
    'no-excessive-comments': noExcessiveComments,
    'no-obvious-comments': noObviousComments,
  },
}

// Add recommended config after plugin is defined
plugin.configs = {
  recommended: {
    plugins: {
      deslop: plugin as any,
    },
    rules: {
      'deslop/no-excessive-comments': 'warn',
      'deslop/no-obvious-comments': 'warn',
    },
  },
}

export default plugin
