<script setup>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const shiftWeek = (amount) => {
  const midpoint = store.getters['date/dates'][3];
  const newWeekId = midpoint.add(amount, 'week').weekId();

  router.push({ name: 'Planner', params: { weekId: newWeekId } });
};
</script>

<template>
  <div class="week-switch">
    <span
      class="material-icons material-icons-round"
      @click="shiftWeek(-1)"
    >chevron_left</span>
    <h2>Week {{ store.getters["date/weekNumber"] }}</h2>
    <span
      class="material-icons material-icons-round"
      @click="shiftWeek(1)"
    >chevron_right</span>
  </div>
</template>
