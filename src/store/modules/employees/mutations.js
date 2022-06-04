export default {
  setUsers(state, payload) {
    state.users = payload;
  },
  addUser(state, { id, data }) {
    state.users.push({ id, ...data });
  },
  totalHours(state, payload) {
    state.totalHours = payload;
  },
  activeUserId(state, payload) {
    state.activeUserId = payload;
  },
  updateUserLocally(state, payload) {
    if (payload.status === 'NEW') {
      state.users.push({
        ...payload,
        status: 'STAGED',
      });

      return;
    }

    state.users = state.users.map((user) => {
      if (user.id !== payload.id) return user;
      return { ...user, ...payload };
    });
  },
};
