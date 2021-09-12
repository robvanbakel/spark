<template>
  <div class="empty-week">
    <h1>Week {{ weekNumber }}</h1>
    <h5>{{ dateRange }}</h5>
    <p>
      No planning has been made for this week yet!<br />
      You can either start with an empty schedule or copy an existing week.
    </p>
    <div class="action-wrapper">
      <div @click="$emit('hideEmptyWeek')"><span class="material-icons material-icons-round">calendar_today</span> Create empty schedule</div>
      <div><span class="material-icons material-icons-round">event_note</span> Copy an existing week</div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['hideEmptyWeek'],
  computed: {
    weekNumber() {
      return parseInt(this.$store.getters["date/weekId"].split("-")[1])
    },
    dateRange() {
      const dates = this.$store.getters["date/dates"]

      const formatDate = (date) => date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

      return `${formatDate(dates[0])} – ${formatDate(dates[dates.length-1])}`
    },
  },
}
</script>

<style></style>
