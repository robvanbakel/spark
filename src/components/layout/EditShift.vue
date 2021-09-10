<template>
  <div class="edit-modal">
    <base-overlay dark transparent></base-overlay>
    <div class="modal" v-if="shift">
      <div class="header">
        <h1 v-if="newShift">New Shift</h1>
        <h1 v-else>Edit Shift</h1>
        <span class="clear material-icons material-icons-round" @click="closeEditShift">clear</span>
      </div>
      <div class="main">
        <div>
          <div class="form-control">
            <label for="name">Name</label>
            <base-select v-if="shift" :selected="shift.employee" @selectedEmployee="switchHandler"></base-select>
          </div>
          <div class="form-control">
            <label for="place">Place</label>
            <div>
              <input type="text" id="place" v-model.trim="shift.place" @input="clearSelectedSuggestion" />
              <div class="suggestions">
                <span
                  v-for="suggestion in $store.getters['settings/suggestions']"
                  :key="suggestion"
                  :class="{ selected: this.selectedSuggestion === suggestion }"
                  @click="selectSuggestion(suggestion)"
                  @click.right="$store.dispatch('settings/deleteSuggestion', { event: $event, suggestion })"
                  >{{ suggestion }}</span
                >
                <span class="add" v-if="showNewSuggestion" @click="$store.dispatch('settings/addSuggestion', { suggestion: shift.place })">
                  <span class="material-icons material-icons-round">add</span>
                  {{ shift.place }}</span
                >
              </div>
            </div>
          </div>
          <div class="form-control">
            <label for="date">Date</label>
            <div class="form-control-date">
              <input type="text" id="date" v-model="shift.date" />
              <div class="form-control-time">
                <span class="input-label-main">Time</span>
                <input
                  type="text"
                  :class="['time', { error: error.start }]"
                  v-model.trim="shift.start"
                  @blur="validateTime(shift.start, 'start')"
                  @input="clearError('start')"
                />
                <span class="input-label">-</span>
                <input
                  type="text"
                  :class="['time', { error: error.end }]"
                  v-model.trim="shift.end"
                  @blur="validateTime(shift.end, 'end')"
                  @input="clearError('end')"
                />
              </div>
            </div>
          </div>
          <div class="form-control">
            <label>Break</label>
            <base-switch :items="$store.getters['planner/breaks']" :active="this.shift.break" @activeItem="setBreak" fixed="true"></base-switch>
          </div>
          <div class="form-control note">
            <label for="note">Notes</label>
            <textarea id="note" v-model="shift.notes"></textarea>
          </div>

          <div class="form-actions">
            <button v-if="!newShift" class="delete" @click="deleteShift">
              <span class="material-icons material-icons-round">delete</span>
            </button>
            <button class="secondary" @click="closeEditShift">Cancel</button>
            <base-button @click="saveEditShift">Save</base-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newShift: true,
      shift: null,
      error: {
        employee: false,
        place: false,
        date: false,
        start: false,
        end: false,
        break: false,
        notes: false,
      },
      selectedSuggestion: null,
    }
  },
  computed: {
    showNewSuggestion() {
      if (
        this.shift.place != "" &&
        !this.$store.getters["settings/suggestions"]
          .map((sug) => {
            return sug.toLowerCase()
          })
          .includes(this.shift.place.toLowerCase())
      ) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    switchHandler(selectedEmployee) {
      this.shift.employee = selectedEmployee
    },
    setBreak(val) {
      if (val === "-") {
        this.shift.break = "0"
      } else {
        this.shift.break = val
      }
    },
    clearError(field) {
      this.error[field] = false
    },
    validateTime(time, field) {
      if (/^([0-9])$/.test(time)) {
        this.shift[field] = `0${time}:00`
      } else if (/^([0-1][0-9]|2[0-3])$/.test(time)) {
        this.shift[field] = `${time}:00`
      } else if (/^([0-1]?[0-9]|2[0-3])\D?([0-5][0-9])$/.test(time)) {
        this.shift[field] = `${time.slice(0, 2)}:${time.slice(-2)}`
      } else {
        this.error[field] = true
      }

      if (this.start && this.end) {
        const [startHour, startMin] = this.start.split(":")
        const [endHour, endMin] = this.end.split(":")

        const start = new Date()
        start.setHours(startHour)
        start.setMinutes(startMin)

        const end = new Date()
        end.setHours(endHour)
        end.setMinutes(endMin)

        if (end <= start && this.end != "00:00") {
          this.error.end = true
        } else {
          this.error.end = false
        }
      }
    },
    selectSuggestion(suggestion) {
      this.shift.place = suggestion
      this.selectedSuggestion = suggestion
    },
    async saveEditShift() {
      const { weekId, day } = await this.$store.dispatch("date/getWeekIdAndDay", this.shift.date)

      const stringifyTime = (time) => time.replace(":", "")

      const shiftId = {
        employeeId: this.shift.employee.id,
        weekId,
        day,
      }

      const shiftInfo = {
        place: this.shift.place,
        start: stringifyTime(this.shift.start),
        end: stringifyTime(this.shift.end),
        break: this.shift.break,
        notes: this.shift.notes || "",
      }

      this.$store.dispatch("planner/saveEditShift", { shiftId, shiftInfo })

      this.closeEditShift()
    },
    closeEditShift() {
      this.$store.dispatch("planner/setActiveShiftId", null)
    },
    deleteShift() {
      this.$store.dispatch("planner/deleteShift")
      this.closeEditShift()
    },
  },
  mounted() {
    // Set boilerplate shift info
    const activeShift = {
      employee: {},
      place: "",
      date: "",
      start: "",
      end: "",
      break: "",
      notes: "",
    }

    if (this.$store.getters["planner/activeShiftId"] !== "new") {
      // Find selected shift
      const { weekId, day, employeeId } = this.$store.getters["planner/activeShiftId"]
      const shift = this.$store.getters["planner/schedules"][weekId][employeeId][day]

      // Helper functions

      const employee = this.$store.getters["employees/employees"].find((emp) => emp.id === employeeId)

      const parseTime = (time) => {
        return time.substring(0, 2) + ":" + time.substring(2, 4)
      }

      const parseDate = () => {
        const [month, date, year] = this.$store.getters["date/dates"][day].toLocaleDateString({ year: "numeric", month: "numeric", day: "numeric" }).split("/")
        return `${date.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`
      }

      // Set boilerplate shift info
      activeShift.employee = {
        fullName: `${employee.firstName} ${employee.lastName}`,
        id: employeeId,
      }
      activeShift.date = parseDate()

      // If active shift exists, set shift info
      if (shift) {
        this.newShift = false

        activeShift.place = shift.place
        activeShift.start = parseTime(shift.start)
        activeShift.end = parseTime(shift.end)
        activeShift.break = shift.break
        activeShift.notes = shift.notes
      }
    }

    this.shift = activeShift
  },
}
</script>
