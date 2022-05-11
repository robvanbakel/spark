<template>
  <div v-if="employee">
    <div class="row" :class="employee.role.toLowerCase()">
      <div class="employee">
        <span class="name">{{ employee.firstName }} {{ employee.lastName }}</span>
        <span class="hours">
          <span class="calculated">
            {{ totalHours.toFixed(2) }}</span> /
            {{ employee.contract }} hours
          </span >
      </div>
      <ShiftBlock
        v-for="(shift, index) in shiftsInView"
        :key="index"
        :shift="shift"
        @click="handleClick(index)"
      />
    </div>
  </div>
  <div v-else>
    <div>
      <div class="row">
        <div class="employee"></div>
        <ShiftBlock v-for="date in $store.getters['date/dates']" :key="date" />
      </div>
    </div>
  </div>
</template>

<script>
import ShiftBlock from '@/components/layout/ShiftBlock.vue';

export default {
  props: ['employeeId', 'search'],
  components: { ShiftBlock },
  watch: {
    search(query) {
      this.searchInput = query;
    },
  },
  data() {
    return {
      searchInput: '',
    };
  },
  computed: {
    employee() {
      return this.$store.getters['employees/users'].find((emp) => emp.id === this.employeeId);
    },
    shiftsInView() {
      return this.$store.getters['date/dates'].map((date) => this.$store.getters['planner/shifts'].find((shift) => shift.employeeId === this.employeeId && this.$dayjs(date).isSame(this.$dayjs(shift.from), 'date')));
    },
    totalHours() {
      const totalHours = this.shiftsInView.reduce((acc, shift) => {
        if (!shift) return acc;
        const shiftDuration = this.$dayjs.duration(this.$dayjs(shift.to).diff(this.$dayjs(shift.from))).subtract(shift.break, 'minutes');
        return acc + shiftDuration.asHours();
      }, 0);

      this.$store.dispatch('employees/totalHours', {
        employeeId: this.employee.id,
        total: totalHours,
      });

      return totalHours;
    },
  },
  methods: {
    handleClick(index) {
      if (this.shiftsInView[index]) {
        this.$store.dispatch('planner/setActiveShiftId', this.shiftsInView[index].shiftId);
      } else {
        this.$store.dispatch('planner/addNewShift', {
          employeeId: this.employeeId,
          from: this.$store.getters['date/dates'][index],
          to: this.$store.getters['date/dates'][index],
        });
      }
    },
  },
};
</script>
