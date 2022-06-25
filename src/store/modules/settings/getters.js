export default {
  mode() {
    return window.location.hostname.split('.')[0];
  },
  dateLocale() {
    return 'en-US';
  },
  admin(state) {
    return state.admin;
  },
  settings(state) {
    return state.settings;
  },
  hideSidebar(state) {
    return state.hideSidebar;
  },
  sidebarAutoHidden(state) {
    return state.sidebarAutoHidden;
  },
  breaks(state) {
    return state.breaks;
  },
  statuses(state) {
    return state.statuses;
  },
};
