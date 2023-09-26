const baseConfig = require('../../../eslint.config.js');
module.exports = [
  ...baseConfig,
  {
    files: [
      'libs/external/logger/**/*.ts',
      'libs/external/logger/**/*.tsx',
      'libs/external/logger/**/*.js',
      'libs/external/logger/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['libs/external/logger/**/*.ts', 'libs/external/logger/**/*.tsx'],
    rules: {},
  },
  {
    files: ['libs/external/logger/**/*.js', 'libs/external/logger/**/*.jsx'],
    rules: {},
  },
];
