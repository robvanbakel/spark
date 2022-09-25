import { defineStore } from "pinia";

import actions from "./actions";
import getters from "./getters";

export default defineStore("settings", {
  state: () => ({
    sidebarHidden: false,
    sidebarAutoHidden: false,
    settings: null,
    isLoaded: false,
    dateLocale: "en-US",
    breaks: ["0", "15", "30", "45", "60"],
    statuses: ["ACTIVE", "UNAVAILABLE", "SICK", "INACTIVE", "STAGED"],
  }),
  actions,
  getters,
});
