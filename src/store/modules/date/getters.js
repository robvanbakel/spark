export default {
  weekId(state) {
    return state.weekId;
  },
  dates(state) {
    return state.dates;
  },
  weekNumber(state) {
    return state.dates[0].format('W');
  },
  dayNamesShort(state, getters) {
    return getters.dates.map((date) => date.format('ddd'));
  },
};
