export default {
  mode() {
    return window.location.hostname.split('.')[0];
  },
  dateLocale() {
    return 'en-US';
  },
  dateNotation(state) {
    return state.dateNotation;
  },
  suggestions(state) {
    return state.suggestions;
  },
  admin(state) {
    return state.admin;
  },
  roles(state) {
    return state.roles;
  },
  hideSidebar(state) {
    return state.hideSidebar;
  },
  sidebarAutoHidden(state) {
    return state.sidebarAutoHidden;
  },
  shareWithEmployees(state) {
    return state.shareWithEmployees;
  },
  breaks(state) {
    return state.breaks;
  },
  statuses(state) {
    return state.statuses;
  },
  location(state) {
    return state.location;
  },
};
