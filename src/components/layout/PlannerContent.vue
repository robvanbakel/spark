<template>
  <PlannerRow v-for="employee in employees" :key="employee" :employee="employee" :search="search" />
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
          if (role === user.role?.toLowerCase()
          && this.$store.getters['planner/shifts'].map((shift) => shift.employeeId).includes(user.id)
          && `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.search.toLowerCase())) {
            output.push(user);
          }
        });
      });

      return output;
    },
  },
};
</script>
