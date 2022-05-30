/**
 * @type {import('eslint').Linter.Config}
 * @see https://eslint.org/docs/user-guide/configuring/
 */
const config = {
  extends: '@antfu',
  overrides: [
    {
      files: 'scripts/*.{ts,mjs}',
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: 'vite.config.ts',
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: 'plugin/**/*.ts',
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: 'packages/main/**/*.ts',
      rules: {
        'no-useless-call': 'off',
        'no-console': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
      },
    },
  ],
}

module.exports = config
