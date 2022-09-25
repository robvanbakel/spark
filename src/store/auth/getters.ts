export default {
  isAdmin() {
    return !!this.user?.admin;
  },
};
