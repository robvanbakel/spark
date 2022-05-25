import dayjs from '@/plugins/dayjs';
import { db, auth } from '@/firebase';

export default {
  async getShifts(context) {
    const idToken = await auth.currentUser.getIdToken();

    const res = await fetch(`${process.env.VUE_APP_ADMIN_HOST || ''}/admin/db/shifts`, {
      headers: { authorization: idToken },
    });

    const shifts = await res.json();

    const formattedShifts = shifts.map((shift) => ({
      ...shift,
      from: dayjs(shift.from),
      to: dayjs(shift.to),
    }));

    context.commit('shifts', formattedShifts);
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
    //   && shiftIdChanged(context.getters.activeShiftId, payload.id)
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
  async deleteShift(context, shiftId = context.getters.activeShiftId) {
    const idToken = await auth.currentUser.getIdToken();

    // Update locally
    context.commit('deleteShiftLocally', shiftId);

    // Update DB
    fetch(`${process.env.VUE_APP_ADMIN_HOST || ''}/admin/db/shifts/${shiftId}`, {
      method: 'DELETE',
      headers: { authorization: idToken },
    });
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
      context.commit('updateShiftLocally', { id: shiftId, status: 'ACCEPTED' });

      // Update DB
      fetch(`${process.env.VUE_APP_ADMIN_HOST || ''}/admin/accept/${shiftId}`, {
        headers: { authorization: idToken },
      });
    });
  },
};
