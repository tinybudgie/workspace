const baseConfig = require('../../eslint.config.js');
module.exports = [
  ...baseConfig,
  {
    files: [
      'apps/api/**/*.ts',
      'apps/api/**/*.tsx',
      'apps/api/**/*.js',
      'apps/api/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['apps/api/**/*.ts', 'apps/api/**/*.tsx'],
    rules: {},
  },
  {
    files: ['apps/api/**/*.js', 'apps/api/**/*.jsx'],
    rules: {},
  },
];
