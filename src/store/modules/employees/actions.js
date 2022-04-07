import router from '@/router';
import { auth, db } from '@/firebase';

export default {
  async getUsers(context) {
    const { uid } = auth.currentUser;

    if (context.rootGetters['settings/admin'].includes(uid)) {
      // Set global auth/admin variable to true
      context.commit('auth/admin', true, { root: true });

      const users = [];

      // If user is admin, load all users from database
      const snapshot = await db.collection('users').get();
      snapshot.forEach((doc) => {
        const user = {
          id: doc.id,
          ...doc.data(),
        };

        users.push(user);

        if (user.id === uid) {
          context.commit('auth/setUser', user, { root: true });
        }
      });

      context.commit('setUsers', users);

      router.push({ name: 'EmployeeList' });
    } else {
      // Set global auth/admin variable to false
      context.commit('auth/admin', false, { root: true });

      const res = await fetch(`${process.env.VUE_APP_ADMIN_HOST || ''}/admin/getUser/${uid}`);
      const user = await res.json();

      context.commit('auth/setUser', user, { root: true });

      router.push({ name: 'Schedule' });
    }
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
};
