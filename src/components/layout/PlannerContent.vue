<template>
  <PlannerRow
    v-for="employee in employees"
    :key="employee.id"
    :employee="employee"
    :schedule="schedules[employee.id]"
    :search="search" />
  <PlannerRow />
</template>

<script>
import PlannerRow from '@/components/layout/PlannerRow.vue';

export default {
  props: {
    schedules: {
      type: Object,
      required: true,
    },
    roles: {
      type: Array,
      required: true,
    },
    search: {
      type: String,
      default: '',
    },
  },
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
  },
};
</script>
