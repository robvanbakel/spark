<template>
  <div class="copy-week-wrapper">
    <base-dropdown :items="weeks" :active="weeks[0].id" @choice="selectWeek"></base-dropdown>
    <base-button @click="copyWeek">Copy</base-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedWeek: null,
    };
  },
  methods: {
    selectWeek(week) {
      this.selectedWeek = week;
    },
    copyWeek() {
      this.$store.dispatch('planner/copyWeek', {
        to: this.$store.getters['date/weekId'],
        from: this.selectedWeek,
      });
    },
  },
  computed: {
    weeks() {
      return Object.keys(this.$store.getters['planner/schedules'])
        .map((weekId) => ({
          id: weekId,
          display: `Week ${parseInt(weekId.split('-')[1], 10)}`,
        }))
        .reverse();
    },
  },
  mounted() {
    this.selectedWeek = this.weeks[0].id;
  },
};
</script>
