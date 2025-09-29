// jest.config.js
export default {
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!your-esm-module-name).+\\.js$', // If you're using ESM packages from node_modules
  ],
};
