import { createStore } from 'vuex';

import employees from './modules/employees';
import auth from './modules/auth';
import planner from './modules/planner';
import date from './modules/date';
import settings from './modules/settings';

const store = createStore({
  modules: {
    employees,
    auth,
    planner,
    date,
    settings,
  },
});

export default store;
