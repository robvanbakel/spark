import { createStore } from 'vuex';

import employees from './modules/employees';
import planner from './modules/planner';
import settings from './modules/settings';

const store = createStore({
  modules: {
    employees,
    planner,
    settings,
  },
});

export default store;
