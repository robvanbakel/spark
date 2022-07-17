export default {
  employees() {
    return this.users
      .filter((emp) => emp.status !== 'ARCHIVED' && emp.status !== 'ADMIN')
      .sort((a, b) => b.createdAt - a.createdAt);
  },
};
