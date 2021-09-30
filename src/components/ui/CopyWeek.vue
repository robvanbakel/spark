<template>
  <div class="copy-week-wrapper">
    <select class="base-select" v-model="selectedWeek">
      <option v-for="week in weeks" :key="week" :value="week.weekId">
        {{ week.display }}
      </option>
    </select>
    <base-button @click="copyWeek">Copy</base-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedWeek: null,
    }
  },
  methods: {
    copyWeek() {
      this.$store.dispatch("planner/copyWeek", {
        to: this.$store.getters['date/weekId'],
        from: this.selectedWeek,
      })
    },
  },
  computed: {
    weeks() {
      return Object.keys(this.$store.getters["planner/schedules"])
        .map((weekId) => {
          return {
            weekId,
            display: `Week ${parseInt(weekId.split("-")[1])}`,
          }
        })
        .reverse()
    },
  },
}
</script>

<style></style>
