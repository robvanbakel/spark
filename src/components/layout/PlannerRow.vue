<template>
  <div v-if="this.role">
    <div v-for="(schedule, employeeId) in $store.getters['planner/currentWeekSchedule']" :key="schedule">
      <div
        class="row"
        v-if="
          employeeInfo(employeeId, 'role') === role &&
            employeeInfo(employeeId, 'status') !== 'archived' &&
            employeeInfo(employeeId, 'fullName')
              .toLowerCase()
              .includes(searchInput.toLowerCase())
        "
      >
        <div class="employee">
          <span class="name">{{ employeeInfo(employeeId, 'fullName') }}</span>
          <span class="hours"
            ><span class="calculated">{{ $store.getters['employees/totalHours'][employeeId] }}</span> /
            {{ employeeInfo(employeeId, 'contract') }} hours</span
          >
        </div>
        <div
          v-for="(shift, day) in $store.getters['planner/currentWeekSchedule'][employeeId]"
          :key="day"
          :class="['day', role, { active: shift, proposed: shift && !shift.accepted }]"
          @click="handleClick({ day, employeeId })"
        >
          <div class="shift-info" v-if="shift">
            <div class="info-wrapper">
              <div class="shift-info-header">
                <span class="place">{{ shift.place }} </span>
                <span class="notes material-icons material-icons-round" v-if="shift.notes && shift.accepted">description</span>
              </div>
              <span class="time">
                {{ $dayjs(shift.from).format('HH:mm') }} - {{ $dayjs(shift.to).format('HH:mm') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div>
      <div class="row">
        <div class="employee">
          <span class="name"></span>
          <span class="hours"></span>
        </div>
        <div v-for="(day, index) in 7" :key="day" :class="['day']" @click="handleClick({ day: index })">
          <div class="shift-info">
            <span class="place"></span>
            <span class="time"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['role', 'search'],
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
      this.$store.dispatch('planner/setActiveShiftId', {
        weekId: this.$store.getters['date/weekId'],
        ...payload,
      });
    },
  },
};
</script>

<style></style>
