import { defineStore } from 'pinia';

import actions from './actions';
import getters from './getters';

export default defineStore('settings', {
  state: () => ({
    admin: null,
    sidebarHidden: false,
    sidebarAutoHidden: false,
    settings: null,
    dateLocale: 'en-US',
    breaks: ['0', '15', '30', '45', '60'],
    statuses: ['ACTIVE', 'UNAVAILABLE', 'SICK', 'INACTIVE', 'STAGED'],
  }),
  actions,
  getters,
});
