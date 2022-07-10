import { createStore } from 'vuex';

import employees from './modules/employees';
import planner from './modules/planner';

const store = createStore({
  modules: {
    employees,
    planner,
  },
});

export default store;
