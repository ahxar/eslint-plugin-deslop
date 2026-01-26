import type { Rule, Linter } from 'eslint'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import noExcessiveComments from './rules/no-excessive-comments.js'
import noObviousComments from './rules/no-obvious-comments.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
)

interface Plugin {
  meta: {
    name: string
    version: string
  }
  rules: Record<string, Rule.RuleModule>
  configs?: {
    recommended?: Linter.Config
  }
}

const plugin: Plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
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
