const { FlatCompat } = require('@eslint/eslintrc');
const baseConfig = require('../../../eslint.config.js');
const js = require('@eslint/js');
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});
module.exports = [
  ...baseConfig,
  {
    files: [
      'libs/external/schematics/**/*.ts',
      'libs/external/schematics/**/*.tsx',
      'libs/external/schematics/**/*.js',
      'libs/external/schematics/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: [
      'libs/external/schematics/**/*.ts',
      'libs/external/schematics/**/*.tsx',
    ],
    rules: {},
  },
  {
    files: [
      'libs/external/schematics/**/*.js',
      'libs/external/schematics/**/*.jsx',
    ],
    rules: {},
  },
  ...compat.config({ parser: 'jsonc-eslint-parser' }).map((config) => ({
    ...config,
    files: [
      'libs/external/schematics/package.json',
      'libs/external/schematics/generators.json',
      'libs/external/schematics/executors.json',
    ],
    rules: { '@nx/nx-plugin-checks': 'error' },
  })),
];
