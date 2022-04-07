module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    // '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': 1,
    'no-debugger': 1,
    'vuejs-accessibility/mouse-events-have-key-events': 0,
    'vuejs-accessibility/click-events-have-key-events': 0,
    'vuejs-accessibility/form-control-has-label': 0,
    'vuejs-accessibility/label-has-for': 0,
    'vuejs-accessibility/no-autofocus': 0,
    'max-len': 0,
  },
};
