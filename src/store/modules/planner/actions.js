import api from '@/utils/api';
import format from '@/utils/format';

export default {
  async getShifts(context) {
    const shifts = await api.get('db/shifts');
    context.commit('shifts', format.shifts.res(shifts));
  },
  setActiveShiftId(context, payload) {
    context.commit('activeShiftId', payload);
  },
  emptyWeek(context, payload) {
    context.commit('emptyWeek', payload);
  },
  addNewShift(context, payload) {
    context.dispatch('setActiveShiftId', 'NEW');
    context.commit('newShiftPrefillData', payload);
  },
  saveEditShift(context, payload) {
    context.commit('updateShiftLocally', payload);

    api[payload.status === 'NEW' ? 'post' : 'patch'](`db/shifts/${payload.id}`, format.shifts.req({
      ...payload,
      status: payload.status === 'NEW' ? 'PROPOSED' : payload.status,
    }));
  },
  deleteShift(context, shiftId = context.getters.activeShiftId) {
    context.commit('deleteShiftLocally', shiftId);
    api.destroy(`db/shifts/${shiftId}`);
  },
  acceptShifts(context, shiftIds) {
    shiftIds.forEach((shiftId) => {
      context.commit('updateShiftLocally', { id: shiftId, status: 'ACCEPTED' });
      api.patch(`accept/${shiftId}`);
    });
  },
};
