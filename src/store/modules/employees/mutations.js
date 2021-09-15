export default {
  setEmployees(state, payload) {
    state.employees = payload
  },
  addUser(state, { id, data }) {
    state.employees.push({ id, ...data })
  },
  updateEmployee(state, payload) {
    const employee = state.employees.find((emp) => emp.id === payload.id)

    if (employee) {
      for (const key in payload.data) {
        employee[key] = payload.data[key]
      }
    } else {
      state.employees[payload.id] = {
        ...payload.data,
      }
    }
  },
}
