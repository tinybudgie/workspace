const baseConfig = require('../../eslint.config.js');
module.exports = [
  ...baseConfig,
  {
    files: [
      'apps/gateway/**/*.ts',
      'apps/gateway/**/*.tsx',
      'apps/gateway/**/*.js',
      'apps/gateway/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['apps/gateway/**/*.ts', 'apps/gateway/**/*.tsx'],
    rules: {},
  },
  {
    files: ['apps/gateway/**/*.js', 'apps/gateway/**/*.jsx'],
    rules: {},
  },
];
