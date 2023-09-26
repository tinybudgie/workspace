const baseConfig = require('../../../eslint.config.js');
module.exports = [
  ...baseConfig,
  {
    files: [
      'libs/external/health-checks/**/*.ts',
      'libs/external/health-checks/**/*.tsx',
      'libs/external/health-checks/**/*.js',
      'libs/external/health-checks/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: [
      'libs/external/health-checks/**/*.ts',
      'libs/external/health-checks/**/*.tsx',
    ],
    rules: {},
  },
  {
    files: [
      'libs/external/health-checks/**/*.js',
      'libs/external/health-checks/**/*.jsx',
    ],
    rules: {},
  },
];
