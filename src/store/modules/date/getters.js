export default {
  weekId(state) {
    return state.weekId;
  },
  dates(state) {
    return state.dates;
  },
  weekNumber(state) {
    return parseInt(state.weekId?.split('-')[1], 10);
  },
  dayNamesShort(state, getters) {
    return getters.dates.map((date) => date.format('ddd'));
  },
};
