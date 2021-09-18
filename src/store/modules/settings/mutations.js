export default {
  suggestions(state, suggestions) {
    state.suggestions = suggestions
  },
  admin(state, admin) {
    state.admin = admin
  },
  roles(state, roles) {
    state.roles = roles
  },
  toggleSidebar(state) {
    state.hideSidebar = !state.hideSidebar
  },
  hideSidebar(state, payload) {
    state.hideSidebar = payload
  },
  sidebarAutoHidden(state, payload) {
    state.sidebarAutoHidden = payload
  },

}