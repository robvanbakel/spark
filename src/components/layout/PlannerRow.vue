<template>
  <div v-if="this.role">
    <div v-for="(schedule, employeeId) in $store.getters['planner/currentWeekSchedule']" :key="schedule">
      <div
        class="row"
        v-if="employeeInfo(employeeId, 'role') === role && employeeInfo(employeeId, 'status') !== 'archived'"
      >
        <div class="employee">
          <span class="name">{{ employeeInfo(employeeId, "fullName") }}</span>
          <span class="hours"
            ><span class="calculated">{{ $store.getters["employees/totalHours"][employeeId] }}</span> /
            {{ employeeInfo(employeeId, "contract") }} hours</span
          >
        </div>
        <div
          v-for="(shift, day) in $store.getters['planner/currentWeekSchedule'][employeeId]"
          :key="day"
          :class="[
            'day',
            role,
            {
              active: shift,
              hidden: !shift?.place.toLowerCase().includes(searchInput.toLowerCase()),
            },
          ]"
          @click="handleClick({ day, employeeId })"
        >
          <div class="shift-info" v-if="shift">
            <div class="info-wrapper">
              <div class="shift-info-header">
                <span class="place"
                  >{{ shift.place }}
                </span>
                  <span class="notes material-icons material-icons-round" v-if="shift.notes">description</span>

              </div>
              <span class="time">
                {{ shift.start.substring(0, 2) }}:{{ shift.start.substring(2, 4) }} - {{ shift.end.substring(0, 2) }}:{{
                  shift.end.substring(2, 4)
                }}
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
  props: ["role", "search"],
  watch: {
    search: function(query) {
      this.searchInput = query
    },
  },
  data() {
    return {
      searchInput: "",
    }
  },
  methods: {
    employeeInfo(id, query) {
      const employee = this.$store.getters["employees/users"].find((emp) => emp.id === id)

      let output = employee[query] || employee

      switch (query) {
        case "fullName":
          output = `${employee.firstName} ${employee.lastName}`
          break
        case "role":
          output = employee.role.toLowerCase()
          break
        case "status":
          output = employee.status
          break
      }

      return output
    },
    shiftInfo(payload, query) {
      const shift = this.$store.getters["planner/currentWeekSchedule"][payload.employeeId][payload.day - 1]

      const formatTime = (time) => time.substring(0, 2) + ":" + time.substring(2, 4)

      if (shift) {
        let output = shift[query] || shift

        switch (query) {
          case "time":
            output = `${formatTime(shift.start)} - ${formatTime(shift.end)}`
            break
        }

        return output
      }
    },
    handleClick(payload) {
      this.$store.dispatch("planner/setActiveShiftId", {
        weekId: this.$store.getters["date/weekId"],
        ...payload,
      })
    },
  },
}
</script>

<style></style>
