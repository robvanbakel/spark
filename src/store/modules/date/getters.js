export default {
  weekId(state) {
    return state.weekId
  },
  dates(state) {
    return state.dates
  },
  weekNumber(state) {
    return parseInt(state.weekId?.split("-")[1])
  },
  dayNames(state, getters, rootState, rootGetters) {
    return state.dates.map((date) => date.toLocaleDateString(rootGetters['settings/dateLocale'], { weekday: "long" }))
  },
  datesShort(state, getters, rootState, rootGetters) {
    return state.dates.map((date) => date.toLocaleDateString(rootGetters['settings/dateLocale'], { year: "numeric", month: "short", day: "numeric" }))
  },
}
