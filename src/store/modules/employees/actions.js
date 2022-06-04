import api from '@/utils/api';
import format from '@/utils/format';

import router from '@/router';
import { auth, db } from '@/firebase';

export default {
  async getUsers(context) {
    const idToken = await auth.currentUser.getIdToken();
    const { uid } = auth.currentUser;

    const res = await fetch(`${process.env.VUE_APP_ADMIN_HOST || ''}/admin/db/users`, {
      headers: { authorization: idToken },
    });

    const users = await res.json();

    if (!users) return;

    if (!Array.isArray(users)) {
      context.commit('auth/setUser', users, { root: true });
      router.push({ name: 'Schedule' });
      return;
    }

    context.commit('auth/setUser', users.find((user) => user.id === uid), { root: true });
    context.commit('auth/admin', true, { root: true });
    context.commit('setUsers', users);
  },

  async updateUser(context, payload) {
    // Update locally
    context.commit('updateUser', payload);

    // Update DB
    db.collection('users')
      .doc(payload.id)
      .update(payload.data);
  },
  async createNewUser(context, payload) {
    // Fallback fake uid for demo environment
    let uid = new Date().toISOString();

    if (!context.rootGetters['auth/user'].demo) {
      // Create new user on Firebase
      const res = await fetch(`${process.env.VUE_APP_ADMIN_HOST || ''}/admin/createNewUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload.employee.email,
          firstName: payload.employee.firstName,
        }),
      });

      // Get uid for new user from response object
      const userRecord = await res.json();
      uid = userRecord.uid;
    }

    // Add timestamp to employee data
    const employeeData = payload.employee;
    employeeData.createdAt = Date.now();

    // Update locally
    context.commit('addUser', {
      id: uid,
      data: payload.employee,
    });

    // Update DB
    db.collection('users')
      .doc(uid)
      .set(payload.employee);
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
  saveEditUser(context, payload) {
    context.commit('updateUserLocally', payload);

    api[payload.status === 'NEW' ? 'post' : 'patch'](`db/users/${payload.id}`, format.users.req({
      ...payload,
      status: payload.status === 'NEW' ? 'STAGED' : payload.status,
    }));
  },
};
