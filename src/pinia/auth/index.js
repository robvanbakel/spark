import { defineStore } from 'pinia';

import actions from './actions';
import getters from './getters';

export default defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions,
  getters,
});
