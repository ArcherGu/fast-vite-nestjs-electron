/**
 * @type {import('eslint').Linter.Config}
 * @see https://eslint.org/docs/user-guide/configuring/
 */
const config = {
  extends: '@antfu',
  overrides: [
    {
      files: 'plugin/**/*.ts',
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: 'src/main/**/*.ts',
      rules: {
        'no-useless-call': 'off',
        'no-console': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
      },
    },
  ],
}

module.exports = config
