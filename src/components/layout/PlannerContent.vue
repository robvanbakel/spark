<template>
  <PlannerRow v-for="role in this.roles" :key="role" :role="role" :search="search" />
  <PlannerRow />
</template>

<script>
import PlannerRow from '@/components/layout/PlannerRow.vue';

export default {
  props: ['roles', 'search'],
  components: { PlannerRow },
};
</script>
