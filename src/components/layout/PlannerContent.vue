<template>
  <PlannerRow
    v-for="(schedule, employeeId) in schedulesInView"
    :key="employeeId"
    :employeeId="employeeId"
    :schedule="schedule"
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
    schedulesInView() {
      const schedule = {};

      this.employees.forEach((employee) => {
        const shiftsInView = this.$store.getters['date/dates']
          .map((date) => this.$store.getters['planner/shifts']
            .find((shift) => shift.employeeId === employee.id && this.$dayjs(date).isSame(this.$dayjs(shift.from), 'date')));

        if (shiftsInView.every((v) => !v)) return;

        const totalHours = shiftsInView.reduce((acc, shift) => {
          if (!shift) return acc;
          const shiftDuration = this.$dayjs.duration(this.$dayjs(shift.to).diff(this.$dayjs(shift.from))).subtract(shift.break, 'minutes');
          return acc + shiftDuration.asHours();
        }, 0);

        this.$store.dispatch('employees/totalHours', {
          employeeId: employee.id,
          total: totalHours,
        });

        schedule[employee.id] = shiftsInView;
      });

      return schedule;
    },
  },
};
</script>
