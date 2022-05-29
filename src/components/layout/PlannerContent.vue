<template>
  <PlannerRow
    v-for="employee in employees"
    :key="employee.id"
    :employee="employee"
    :schedule="scheduleInView[employee.id]"
    :search="search" />
  <PlannerRow />
</template>

<script>
import PlannerRow from '@/components/layout/PlannerRow.vue';

export default {
  props: ['roles', 'search'],
  components: { PlannerRow },
  computed: {
    employees() {
      const output = [];

      this.roles.forEach((role) => {
        this.$store.getters['employees/users'].forEach((user) => {
          if (role === user.role?.toLowerCase() && `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.search.toLowerCase())) {
            output.push(user);
          }
        });
      });

      return output;
    },
    scheduleInView() {
      return this.$store.getters['planner/scheduleInView'];
    },
  },
};
</script>
