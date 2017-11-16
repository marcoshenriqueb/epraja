module.exports = {
  "extends": "airbnb",
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
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
  }
};