const baseConfig = require('../../eslint.config.js');
module.exports = [
  ...baseConfig,
  {
    files: [
      'apps/api-e2e/**/*.ts',
      'apps/api-e2e/**/*.tsx',
      'apps/api-e2e/**/*.js',
      'apps/api-e2e/**/*.jsx',
    ],
    rules: {},
  },
];
