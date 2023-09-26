const baseConfig = require('../../../eslint.config.js');
module.exports = [
  ...baseConfig,
  {
    files: [
      'libs/external/nats/**/*.ts',
      'libs/external/nats/**/*.tsx',
      'libs/external/nats/**/*.js',
      'libs/external/nats/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['libs/external/nats/**/*.ts', 'libs/external/nats/**/*.tsx'],
    rules: {},
  },
  {
    files: ['libs/external/nats/**/*.js', 'libs/external/nats/**/*.jsx'],
    rules: {},
  },
];
