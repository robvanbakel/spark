import { createStore } from 'vuex';

import planner from './modules/planner';

const store = createStore({
  modules: {
    planner,
  },
});

export default store;
