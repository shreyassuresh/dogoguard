module.exports = {
  extends: ['universe/native'],
  rules: {
    'import/order': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
}; 