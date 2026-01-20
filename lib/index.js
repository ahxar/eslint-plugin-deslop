import noExcessiveComments from './rules/no-excessive-comments.js'
import noObviousComments from './rules/no-obvious-comments.js'

const plugin = {
  meta: {
    name: 'eslint-plugin-deslop',
    version: '0.1.0',
  },
  rules: {
    'no-excessive-comments': noExcessiveComments,
    'no-obvious-comments': noObviousComments,
  },
  configs: {
    recommended: {
      plugins: ['deslop'],
      rules: {
        'deslop/no-excessive-comments': 'warn',
        'deslop/no-obvious-comments': 'warn',
      },
    },
  },
}

export default plugin
