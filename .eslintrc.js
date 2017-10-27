module.exports = {
  "extends": "standard",
  "plugins": [
    "react"
  ],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": 'module',
    "ecmaFeatures": {
      "jsx": true
    }
  },
  'rules': {
    // Recognizes JSX components vars used.
    "react/jsx-uses-vars": "error",
  }
};