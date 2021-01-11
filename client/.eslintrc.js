module.exports = {
  root: true,
  parserOptions: {
    "parser": "babel-eslint"
  },
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "comma-dangle": 'off',
    "indent": ["error", 4]
  },
};
