const baseConfig = require('../../eslint.config.js');
module.exports = [
  ...baseConfig,
  {
    files: [
      'libs/sample/**/*.ts',
      'libs/sample/**/*.tsx',
      'libs/sample/**/*.js',
      'libs/sample/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['libs/sample/**/*.ts', 'libs/sample/**/*.tsx'],
    rules: {},
  },
  {
    files: ['libs/sample/**/*.js', 'libs/sample/**/*.jsx'],
    rules: {},
  },
];
