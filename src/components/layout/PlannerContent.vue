<template>
  <div>
    <div v-for="(schedule, employeeId) in $store.getters['planner/currentWeekSchedule']" :key="schedule">
      <div class="row" v-if="employeeInfo(employeeId, 'role') === role">
        <div class="employee">
          <span class="name">{{ employeeInfo(employeeId, "fullName") }}</span>
          <span class="hours">{{ totalHours(employeeId) }} hours</span>
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
            <span class="place">{{ shift.place }}</span>
            <span class="time">
              {{ shift.start.substring(0, 2) }}:{{ shift.start.substring(2, 4) }} - {{ shift.end.substring(0, 2) }}:{{ shift.end.substring(2, 4) }}
            </span>
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
      const employee = this.$store.getters["employees/employees"].find((emp) => emp.id === id)

      let output = employee[query] || employee

      switch (query) {
        case "fullName":
          output = `${employee.firstName} ${employee.lastName}`
          break
        case "role":
          output = employee.role.toLowerCase()
          break
      }

      return output
    },
    totalHours(id) {
      let total = 0

      this.$store.getters["planner/currentWeekSchedule"][id].forEach((shift) => {
        if (shift) {
          const [startHours, startMinutes] = shift.start.match(/\d{2}/g)
          const [endHours, endMinutes] = shift.end.match(/\d{2}/g)

          const start = new Date(0)
          start.setHours(startHours)
          start.setMinutes(startMinutes)
          const end = new Date(0)

          end.setHours(endHours)
          end.setMinutes(endMinutes)

          const totalHours = Math.abs(start - end)

          total += totalHours / 1000 / 60 / 60
          total -= shift.break / 60
        }
      })

      return total.toFixed(2)
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
