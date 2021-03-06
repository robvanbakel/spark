module.exports = {
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['dist'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'airbnb-base',
  ],
  rules: {
    'max-len': 0,
    'vue/require-default-prop': 0,
    'no-use-before-define': 0,
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
      files: ['./src/store/**/*.js'],
      rules: {
        'import/no-cycle': 0,
      },
    },
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
      },
    },
  },
};
