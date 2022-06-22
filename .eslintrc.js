module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  rules: {
  },
  ignorePatterns: ['dist'],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
      },
    },
  },
  overrides: [
    {
      files: ['./vite.config.js'],
      rules: {
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      },
    },
    {
      files: ['./src/plugins/dayjs.js'],
      rules: {
        'func-names': 0,
      },
    },
    {
      files: ['./src/router/**/*.js', './src/store/**/*.js'],
      rules: {
        'import/no-cycle': 0,
      },
    },
  ],
};
