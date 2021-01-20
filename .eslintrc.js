module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: false
    }
  },
  rules: {
    // assertionStyle: ['error', 'angle-bracket']
  }
}
