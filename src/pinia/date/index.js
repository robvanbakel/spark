import { defineStore } from 'pinia';

import actions from './actions';
import getters from './getters';

export default defineStore('date', {
  state: () => ({
    dates: [],
  }),
  actions,
  getters,
});
