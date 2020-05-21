const fs = require('fs')

const prettierOptions = JSON.parse(fs.readFileSync('./.prettierrc', 'utf8'))

// http://eslint.org/docs/user-guide/configuring
// https://github.com/prettier/prettier#eslint
module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  env: {
    browser: true,
    jest: true,
    es6: true,
    node: true,
  },
  plugins: ['prettier', 'json'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      classes: true,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'app'],
        extensions: ['.js', '.json', '.android.js', '.ios.js'],
      },
    },
  },
  globals: {
    describe: true,
    test: true,
    jest: true,
    expect: true,
    fetch: true,
    navigator: true,
    __DEV__: true,
    XMLHttpRequest: true,
    FormData: true,
    React$Element: true,
  },
  rules: {
    'prefer-promise-reject-errors': 0,
    'prettier/prettier': ['error', prettierOptions],
    'import/prefer-default-export': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/sort-prop-types': [1, { callbacksLast: true }],
    'react/jsx-sort-default-props': 1,
    'react/jsx-no-bind': [2, { allowArrowFunctions: true, allowBind: false }],
    'react/jsx-boolean-value': 2,
    'react/jsx-handler-names': 2,
    'react/destructuring-assignment': 0,
    'react/forbid-foreign-prop-types': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
    'no-redeclare': [2, { builtinGlobals: true }],
    'no-underscore-dangle': ['error', { allow: ['_id', '_rev'] }],
    'no-console': 0,
    'no-shadow': [
      2,
      {
        builtinGlobals: true,
        allow: [
          'location',
          'event',
          'history',
          'find',
          'root',
          'name',
          'close',
          'Map',
          'Image',
          'Text',
          'Request',
          'fetch',
          'StyleSheet',
          'Screen',
          'screen',
          'toString',
          'status',
          'navigator',
          'isNaN',
          'Option',
        ],
      },
    ],
  },
}
