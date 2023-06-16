const nxPreset = require('@nx/jest/preset').default;

const globalConf = {
  collectCoverage: true,
  coverageDirectory: `${process.env.NX_WORKSPACE_ROOT}/coverage/${process.env['NX_TASK_TARGET_PROJECT']}`,
};

module.exports = {
  ...nxPreset,
  ...globalConf,
};
