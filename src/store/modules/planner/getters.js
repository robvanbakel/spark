import dayjs from '@/plugins/dayjs';
import store from '@/store';

export default {
  schedules(state) {
    return state.schedules;
  },
  shifts(state) {
    return state.shifts;
  },
  scheduleInView(state, getters, rootState, rootGetters) {
    const scheduleInView = getters.shifts.reduce((acc, shift) => {
      const index = rootGetters['date/dates'].findIndex((date) => date.isSame(shift.from, 'day'));

      if (!acc[shift.employeeId]) {
        acc[shift.employeeId] = new Array(rootGetters['date/dates'].length);
      }

      if (index >= 0) {
        acc[shift.employeeId][index] = shift;
      }

      return acc;
    }, {});

    const totalHours = Object.entries(scheduleInView).reduce((acc, [employeeId, schedule]) => {
      acc[employeeId] = schedule.reduce((total, shift) => {
        if (!shift) return total;
        const shiftDuration = dayjs.duration(shift.to.diff(shift.from)).subtract(shift.break, 'minutes');
        return total + shiftDuration.asHours();
      }, 0);

      return acc;
    }, {});

    store.dispatch('employees/totalHours', totalHours);

    return scheduleInView;
  },
  activeShiftId(state) {
    return state.activeShiftId;
  },
  randomShiftId() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    let string = '';
    for (let i = 0; i < 20; i += 1) {
      string += chars[Math.floor(Math.random() * chars.length)];
    }
    return string;
  },
  newShiftPrefillData(state) {
    return state.newShiftPrefillData;
  },
};
