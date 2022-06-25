export default {
  admin(state, admin) {
    state.admin = admin;
  },
  toggleSidebar(state) {
    state.hideSidebar = !state.hideSidebar;
  },
  hideSidebar(state, payload) {
    state.hideSidebar = payload;
  },
  sidebarAutoHidden(state, payload) {
    state.sidebarAutoHidden = payload;
  },
  settings(state, payload) {
    state.settings = payload;
  },
};
