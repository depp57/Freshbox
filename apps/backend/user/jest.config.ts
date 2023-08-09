/* eslint-disable */
export default {
  displayName: 'test',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/test',
  coveragePathIgnorePatterns: ['entity', 'dto', 'mock'],
};
