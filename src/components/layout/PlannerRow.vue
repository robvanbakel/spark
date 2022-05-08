<template>
  <div v-if="employee">
    <div class="row" :class="employee.role.toLowerCase()">
      <div class="employee">
        <span class="name">{{ employee.firstName }} {{ employee.lastName }}</span>
        <span class="hours"
          ><span class="calculated">{{ $store.getters['employees/totalHours'][employeeId] }}</span> /
          {{ employeeInfo(employeeId, 'contract') }} hours</span
        >
      </div>
      <ShiftBlock
        v-for="date in $store.getters['date/dates']"
        :key="date"
        :shiftId="findShiftId(date)"
        @click="handleClick(date)"
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
  },
  methods: {
    findShiftId(date) {
      return this.$store.getters['planner/shifts'].find((shift) => shift.employeeId === this.employeeId && this.$dayjs(date).isSame(this.$dayjs(shift.from), 'date'))?.shiftId;
    },
    employeeInfo(id, query) {
      const employee = this.$store.getters['employees/users'].find((emp) => emp.id === id);

      let output = employee[query] || employee;

      switch (query) {
        case 'fullName':
          output = `${employee.firstName} ${employee.lastName}`;
          break;
        case 'role':
          output = employee.role.toLowerCase();
          break;
        case 'status':
          output = employee.status;
          break;
        default:
          break;
      }

      return output;
    },
    handleClick(date) {
      const shiftId = this.findShiftId(date);

      if (shiftId) {
        this.$store.dispatch('planner/setActiveShiftId', shiftId);
      } else {
        this.$store.dispatch('planner/addNewShift', {
          employeeId: this.employeeId,
          from: date,
          to: date,
        });
      }
    },
  },
};
</script>

<style></style>
