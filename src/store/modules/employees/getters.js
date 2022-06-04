export default {
  users(state) {
    return state.users;
  },
  employees(state) {
    return state.users
      .filter((emp) => emp.status !== 'ARCHIVED' && emp.status !== 'ADMIN')
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  totalHours(state) {
    return state.totalHours;
  },
  activeUserId(state) {
    return state.activeUserId;
  },
};
