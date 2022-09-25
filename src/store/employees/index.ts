import { defineStore } from "pinia";

import actions from "./actions";
import getters from "./getters";

export default defineStore("employees", {
  state: () => ({
    users: [],
    totalHours: {},
    activeUserId: null,
  }),
  actions,
  getters,
});
