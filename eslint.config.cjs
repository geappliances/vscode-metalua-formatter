const eslint = require('@eslint/js');
const globals = require('globals');

module.exports = [
  eslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
        ...globals.jasmine,
        ...globals.es6
      }
    },
    rules: {
      'semi': 2,
      'no-unused-expressions': 2,
      'no-unused-labels': 2,
      'no-unsafe-finally': 'off',
      'no-prototype-builtins': 'off',
      'no-empty': 'off',
      'no-unused-vars': [
        'error',
        {
          caughtErrors: 'none'
        }
      ]
    },
    ignores: ['dist', 'build']
  }
];
