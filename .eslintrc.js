module.exports = {
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'airbnb-base',
  ],
  rules: {
    'max-len': 0,
    'vue/require-default-prop': 0,
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
    {
      files: ['./src/store/**/*.js'],
      rules: {
        'no-param-reassign': 0,
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
