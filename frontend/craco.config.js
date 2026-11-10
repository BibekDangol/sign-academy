const path = require("path");

module.exports = {
  jest: {
    configure: {
      moduleNameMapper: {
        '^axios$': path.resolve(__dirname, 'node_modules/axios/dist/browser/axios.cjs'),
      },
    },
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};
