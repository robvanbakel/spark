export default {
  weekId() {
    return this.dates[0].weekId();
  },
  weekNumber() {
    return Number(this.weekId.split("-")[1]);
  },
};
