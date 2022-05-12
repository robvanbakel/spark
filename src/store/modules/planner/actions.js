import { db, auth } from '@/firebase';

export default {
  async getShifts(context) {
    let schedules = {};

    if (context.rootGetters['auth/admin']) {
      // If user is admin, get all schedules from DB
      let snapshot;

      if (process.env.NODE_ENV === 'development') {
        const res = await fetch(`${process.env.VUE_APP_DATA}/shifts`);
        const shifts = await res.json();
        snapshot = shifts.map(({ id, data }) => ({ id, data: () => data }));
      } else {
        snapshot = await db.collection('shifts').get();
        snapshot = snapshot.docs;
      }

      const shifts = snapshot.map((shift) => ({
        ...shift.data(),
        shiftId: shift.id,
      }));

      context.commit('shifts', shifts);
    } else {
      // If user is not admin, get schedules associated with current user
      const res = await fetch(
        `${process.env.VUE_APP_ADMIN_HOST || ''}/admin/getSchedules/${context.rootGetters['auth/user'].id}`,
      );
      schedules = await res.json();
    }

    context.commit('schedules', schedules);
  },
  setActiveShiftId(context, payload) {
    context.commit('activeShiftId', payload);
  },
  addNewShift(context, payload) {
    context.dispatch('setActiveShiftId', 'NEW');
    context.commit('newShiftPrefillData', payload);
  },
  async saveEditShift(context, payload) {
    // // Helper function to check if two ojbects have equal values
    // const shiftIdChanged = (obj1, obj2) => {
    //   // eslint-disable-next-line no-restricted-syntax
    //   for (const key in obj1) {
    //     if (obj1[key] !== obj2[key]) {
    //       return true;
    //     }
    //   }
    //   return false;
    // };

    // // If shiftId changed, remove shift with old shiftId
    // if (
    //   context.getters.activeShiftId !== 'new'
    //   && shiftIdChanged(context.getters.activeShiftId, payload.shiftId)
    // ) {
    //   context.dispatch('deleteShift');
    // }

    // Update locally
    context.commit('updateShiftLocally', payload);

    // Update DB
    // db.collection('schedules')
    //   .doc(weekId)
    //   .set({ [employeeId]: [...schedule] }, { merge: true });
  },
  deleteShift(context, shiftId = context.getters.activeShiftId) {
    // Update locally
    context.commit('deleteShiftLocally', shiftId);

    // Update DB
    db.collection('shifts')
      .doc(shiftId)
      .delete();
  },
  async copyWeek(context, payload) {
    // Get schedule
    const schedule = context.getters.schedules[payload.from];

    // Update locally
    context.commit('setSchedule', {
      weekId: payload.to,
      schedule,
    });

    // Update DB
    db.collection('schedules')
      .doc(payload.to)
      .set(schedule);
  },
  async acceptShifts(context, shiftIds) {
    const idToken = await auth.currentUser.getIdToken();
    shiftIds.forEach((shiftId) => {
      // Update locally
      const weekId = context.rootGetters['date/weekId'];
      const schedules = context.getters.schedules[weekId];
      const selectedShift = schedules.find((shift) => shift?.shiftId === shiftId);

      context.commit('acceptShiftLocally', {
        weekId,
        shiftId,
        selectedShift,
      });

      // Update DB
      fetch(`${process.env.VUE_APP_ADMIN_HOST || ''}/admin/accept/${shiftId}`, {
        headers: { authorization: idToken },
      });
    });
  },
};
