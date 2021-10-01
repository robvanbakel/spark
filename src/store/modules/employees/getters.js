export default {
  users(state) {
    return state.users
  },
  employees(state) {
    return state.users.filter((emp) => emp.status != "archived" && emp.status != "admin")
  },
}
