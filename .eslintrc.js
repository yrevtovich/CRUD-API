const { resolve } = require('path');

module.exports = {
  root: true,
  env: {
    browser: false,
    node: true
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    extraFileExtensions: ['.ts'],
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 'latest',
    sourceType: 'module'
  },  
  plugins: [
    "@typescript-eslint",
    'prettier'
  ],
  rules: {
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
  },
  settings: {
    "import/resolver": {
      typescript: {}
    }
  }
  
};
