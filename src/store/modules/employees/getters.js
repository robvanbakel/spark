export default {
  users(state) {
    return state.employees
  },
  employees(state) {
    return state.employees.filter((emp) => emp.status != "archived" && emp.status != "admin")
  },
}
