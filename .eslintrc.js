module.exports = {
  root: true,
  env: {
    'vue/setup-compiler-macros': true,
    node: true,
    es6: true,
    browser: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser'
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
    '@aegis.inc/eslint-config-aegis'
  ],
  rules: {
    // '@typescript-eslint/no-explicit-any': 'error',
    'vue/name-property-casing': 'off'
  },
  // 声明全局变量
  globals: {
    // var1: 'writable',
    // var2: 'readonly',
  }
};
