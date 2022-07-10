import api from '@/utils/api';
import format from '@/utils/format';

import { useAuth } from '@/pinia';

import auth from '@/firebase';

export default {
  async getUsers(context) {
    const users = await api.get('db/users');

    const authStore = useAuth();

    if (!Array.isArray(users)) {
      authStore.user = users;
      return;
    }

    const { uid } = auth.currentUser;

    authStore.user = users.find((user) => user.id === uid);
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
