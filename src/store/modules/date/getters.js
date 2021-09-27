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
  dayNames(state) {
    return state.dates.map((date) => date.toLocaleDateString("en-US", { weekday: "long" }))
  },
  datesShort(state) {
    return state.dates.map((date) => date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }))
  },
}
