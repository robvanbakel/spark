<template>
  <div v-if="employee">
    <div>
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
          :shiftId="$store.getters['planner/shifts'].find(shift => shift.employeeId === this.employeeId && $dayjs(date).isSame($dayjs(shift.from), 'date'))?.shiftId"
        />
      </div>
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
    handleClick(payload) {
      console.log(payload);
      // this.$store.dispatch('planner/setActiveShiftId', {
      //   weekId: this.$store.getters['date/weekId'],
      //   ...payload,
      // });
    },
  },
};
</script>

<style></style>
