<template>
  <div class="empty-week">
    <week-switch></week-switch>
    <!-- <h1>Week {{ $store.getters['date/weekNumber'] }}</h1> -->
    <h5>{{ dateRange }}</h5>
    <p>
      No planning has been made for this week yet!<br />
      You can either start with an empty schedule or copy an existing week.
    </p>
    <div class="action-wrapper">
        <div :class="['action', { transparent: showCopyWeek }]" @click="$emit('hideEmptyWeek')"><span class="material-icons material-icons-round">calendar_today</span> Create empty schedule</div>
        <CopyWeek v-if="showCopyWeek" />
        <div class="action" @click="showCopyWeek = true" v-else><span class="material-icons material-icons-round">event_note</span> Copy an existing week</div>
    </div>
  </div>
</template>

<script>
import CopyWeek from "@/components/ui/CopyWeek"

export default {
  emits: ["hideEmptyWeek"],
  components: { CopyWeek },
  data() {
    return {
      showCopyWeek: false,
    }
  },
  computed: {
    dateRange() {
      const dates = this.$store.getters["date/dates"]

      const formatDate = (date) => date.toLocaleDateString(this.$store.getters['settings/dateLocale'], { year: "numeric", month: "long", day: "numeric" })

      return `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`
    },
  },
  watch: {
    $route(to) {
      if (to.name === "Planner") {
        this.showCopyWeek = false
      }
    },
  },
}
</script>

<style></style>
