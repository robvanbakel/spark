import { defineStore } from 'pinia';

import actions from './actions';
import getters from './getters';

export default defineStore('planner', {
  state: () => ({
    schedules: null,
    shifts: [],
    activeShiftId: null,
    newShiftPrefillData: null,
    emptyWeek: true,
  }),
  actions,
  getters,
});
