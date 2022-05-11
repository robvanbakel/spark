export default {
  users(state) {
    return state.users;
  },
  employees(state) {
    return state.users
      .filter((emp) => emp.status !== 'archived' && emp.status !== 'admin')
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  totalHours(state) {
    return state.totalHours;
  },
};
