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
            <base-select
              :class="{ error: error.employee }"
              v-if="shift"
              :selected="shift.employee"
              @selectedEmployee="switchHandler"
              @change="clearError('employee')"
            ></base-select>
          </div>
          <div class="form-control">
            <label for="place">Place</label>
            <div>
              <input type="text" :class="{ error: error.place }" id="place" v-model.trim="shift.place" @input="clearError('place')" />
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
              <input type="text" :class="{ error: error.date }" @input="clearError('date')" id="date" v-model="shift.date" />
              <div class="form-control-time">
                <span class="input-label-main">Time</span>
                <input
                  type="text"
                  :class="['time', { error: error.start }]"
                  v-model.trim="shift.start"
                  @blur="formatTime(shift.start, 'start')"
                  @input="clearError('start')"
                />
                <span class="input-label">-</span>
                <input
                  type="text"
                  :class="['time', { error: error.end }]"
                  v-model.trim="shift.end"
                  @blur="formatTime(shift.end, 'end')"
                  @input="clearError('end')"
                />
              </div>
            </div>
          </div>
          <div class="form-control">
            <label>Break</label>
            <base-switch :items="$store.getters['planner/breaks']" :active="this.shift.break" @activeItem="setBreak" :fixed="true"></base-switch>
          </div>
          <div class="form-control note">
            <label for="note">Notes</label>
            <textarea id="note" v-model="shift.notes"></textarea>
          </div>

          <base-confirm message="Deleting this shift cannot be undone." choiceTrue="Delete Shift" v-if="showConfirmDelete" @choice="deleteShift" />

          <div class="form-actions">
            <button v-if="!newShift" class="delete" @click="showConfirmDelete = true">
              <span class="material-icons material-icons-round">delete</span>
            </button>
            <button class="secondary" @click="closeEditShift">Cancel</button>
            <base-button @click="validate">Save</base-button>
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
      },
      selectedSuggestion: null,
      showConfirmDelete: false,
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
    formatTime(time, field) {
      if (/^([0-9])$/.test(time)) {
        this.shift[field] = `0${time}:00`
      } else if (/^([0-1][0-9]|2[0-3])$/.test(time)) {
        this.shift[field] = `${time}:00`
      } else if (/^([0-1]?[0-9]|2[0-3])\D?([0-5][0-9])$/.test(time)) {
        this.shift[field] = `${time.slice(0, 2)}:${time.slice(-2)}`
      }
    },
    selectSuggestion(suggestion) {
      this.shift.place = suggestion
      this.error.place = false
      this.selectedSuggestion = suggestion
    },
    validate() {
      // Validate field: employee
      if (this.shift.employee.id) {
        this.error.employee = false
      } else {
        this.error.employee = true
      }

      // Validate field: place
      if (this.shift.place) {
        this.error.place = false
      } else {
        this.error.place = true
      }

      // Validate field: date
      if (/^\d{2}-\d{2}-\d{4}$/.test(this.shift.date)) {
        this.error.date = false
      } else {
        this.error.date = true
      }

      const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/

      // Validate field: start
      if (timeRegex.test(this.shift.start)) {
        this.error.start = false
      } else {
        this.error.start = true
      }

      // Validate field: end
      if (timeRegex.test(this.shift.end)) {
        this.error.end = false
      } else {
        this.error.end = true
      }

      // Check if start is before end
      if (!this.error.start && !this.error.start) {
        const [startHour, startMin] = this.shift.start.split(":")
        const [endHour, endMin] = this.shift.end.split(":")

        const start = new Date()
        start.setHours(startHour)
        start.setMinutes(startMin)

        const end = new Date()
        end.setHours(endHour)
        end.setMinutes(endMin)

        if (end <= start && this.shift.end != "00:00") {
          this.error.end = true
        } else {
          this.error.end = false
        }
      }

      if (!Object.values(this.error).includes(true)) {
        this.saveEditShift()
      }
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
    deleteShift(confirmed) {
      if (confirmed) {
        this.$store.dispatch("planner/deleteShift")
        this.closeEditShift()
      }

      this.showConfirmDelete = false
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
