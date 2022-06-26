import api from '@/utils/api';
import format from '@/utils/format';

import router from '@/router';
import auth from '@/firebase';

export default {
  async getUsers(context) {
    const users = await api.get('db/users');

    if (!Array.isArray(users)) {
      context.commit('auth/setUser', users, { root: true });
      router.push({ name: 'Schedule' });
      return;
    }

    const { uid } = auth.currentUser;

    context.commit('auth/setUser', users.find((user) => user.id === uid), { root: true });
    context.commit('auth/admin', true, { root: true });
    context.commit('setUsers', users);
  },
  totalHours(context, payload) {
    context.commit('totalHours', payload);
  },
  activeUserId(context, payload) {
    context.commit('activeUserId', payload);
  },
  addNewUser(context) {
    context.commit('activeUserId', 'NEW');
  },
  async saveEditUser(context, payload) {
    const res = await api[payload.status === 'NEW' ? 'post' : 'patch'](`db/users/${payload.id}`, format.users.req(payload));

    if (res.ok) {
      context.commit('updateUserLocally', payload);
      return;
    }

    throw await res.json();
  },
};
