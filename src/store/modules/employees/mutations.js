export default {
  setUsers(state, payload) {
    state.users = payload;
  },
  addUser(state, { id, data }) {
    state.users.push({ id, ...data });
  },
  updateUser(state, payload) {
    const user = state.users.find((emp) => emp.id === payload.id);

    if (user) {
      Object.keys(payload.data).forEach((key) => {
        user[key] = payload.data[key];
      });
    } else {
      state.users[payload.id] = {
        ...payload.data,
      };
    }
  },
};
