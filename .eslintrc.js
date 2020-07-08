module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 11
  },
  rules: {
    semi: [2, 'always', { omitLastInOneLineBlock: true }],
    camelcase: ['error', { ignoreDestructuring: true, properties: 'never' }],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }],
    eqeqeq: ['error', 'smart']

  }

}
