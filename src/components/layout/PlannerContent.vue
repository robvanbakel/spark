<template>
  <PlannerRow v-for="employeeId in employeeIds" :key="employeeId" :employeeId="employeeId" :search="search" />
  <PlannerRow />
</template>

<script>
import PlannerRow from '@/components/layout/PlannerRow.vue';

export default {
  props: ['roles', 'search'],
  components: { PlannerRow },
  computed: {
    employeeIds() {
      return [...new Set(this.$store.getters['planner/shifts'].map((shift) => shift.employeeId))];
    },
  },
};
</script>
