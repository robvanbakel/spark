export default {
  schedules(state, payload) {
    state.schedules = payload;
  },
  activeShiftId(state, payload) {
    state.activeShiftId = payload;
  },
  updateShiftLocally(state, payload) {
    const { weekId, day, employeeId } = payload.shiftId;
    state.schedules[weekId][employeeId][day] = payload.shiftInfo;
  },
  acceptShiftLocally(state, { weekId, shiftId, selectedShift }) {
    const index = state.schedules[weekId].findIndex((shift) => shift?.shiftId === shiftId);
    state.schedules[weekId][index] = {
      ...selectedShift,
      accepted: true,
    };
  },
  setSchedule(state, { weekId, schedule }) {
    state.schedules[weekId] = JSON.parse(JSON.stringify(schedule));
  },
  createEmptySchedule(state, { weekId, employeeId }) {
    // If weekId does not exist, create empty weekId
    if (!state.schedules[weekId]) {
      state.schedules[weekId] = {};
    }

    // If schedule does not exist, create empty schedule
    if (!state.schedules[weekId][employeeId]) {
      state.schedules[weekId][employeeId] = new Array(7).fill(null);
    }
  },
  deleteScheduleLocally(state, { weekId, employeeId }) {
    delete state.schedules[weekId][employeeId];
  },
  deleteWeekLocally(state, weekId) {
    delete state.schedules[weekId];
  },
};
