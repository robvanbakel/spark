<template>
  <div class="week-switch">
    <span
      class="material-icons material-icons-round"
      @click="shiftWeek(-1)"
    >chevron_left</span>
    <h2>Week {{ $store.getters["date/weekNumber"] }}</h2>
    <span
      class="material-icons material-icons-round"
      @click="shiftWeek(1)"
    >chevron_right</span>
  </div>
</template>

<script>
export default {
  methods: {
    async shiftWeek(amount) {
      const midpoint = this.$store.getters['date/dates'][3];
      const newWeekId = midpoint.add(amount, 'week').weekId();

      this.$router.push({ name: 'Planner', params: { weekId: newWeekId } });
    },
  },
};
</script>
