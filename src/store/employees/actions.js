import api from '@/utils/api';
import format from '@/utils/format';

import { useAuth } from '@/store';

import auth from '@/firebase';

export default {
  async getUsers() {
    const users = await api.get('db/users');

    const authStore = useAuth();

    if (!Array.isArray(users)) {
      authStore.user = users;
      return;
    }

    const { uid } = auth.currentUser;

    authStore.user = users.find((user) => user.id === uid);

    this.users = users;
  },
  addNewUser() {
    this.activeUserId = 'NEW';
  },
  async saveEditUser(payload) {
    const res = await api[payload.status === 'NEW' ? 'post' : 'patch'](`db/users/${payload.id}`, format.users.req(payload));

    if (res.ok) {
      if (payload.status === 'NEW') {
        this.users.push({
          ...payload,
          status: 'STAGED',
        });

        return;
      }

      this.users = this.users.map((user) => {
        if (user.id !== payload.id) return user;
        return { ...user, ...payload };
      });
      return;
    }

    throw await res.json();
  },
};
