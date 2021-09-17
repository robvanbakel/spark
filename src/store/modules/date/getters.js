export default {
  weekId(state) {
    return state.weekId
  },
  weekNumber(state){
    return parseInt(state.weekId.split("-")[1])
  },
  dates(state) {
    return state.dates
  },
  dateIds(state) {
    return state.dateIds
  },
  dayNames(state) {
    return state.dayNames;
  },
  datesShort(state) {
    return state.datesShort;
  },
  daysVisible(state) {
    return state.daysVisible;
  },
  calendarPoint(state) {
    return state.calendarPoint;
  },
}