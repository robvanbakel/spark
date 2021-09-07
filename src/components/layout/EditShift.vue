<template>
  <div class="edit-modal">
    <base-overlay dark transparent></base-overlay>
    <div class="modal">
      <div class="header">
        <h1 v-if="$store.getters['planner/newShift']">New Shift</h1>
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
            <base-switch
              v-if="this.shift"
              :items="$store.getters['planner/breaks']"
              :active="this.shift.break"
              @activeItem="setBreak"
              fixed="true"
            ></base-switch>
          </div>
          <div class="form-control note">
            <label for="note">Notes</label>
            <textarea id="note" v-model="shift.notes"></textarea>
          </div>

          <div class="form-actions">
            <button v-if="!$store.getters['planner/newShift']" class="delete" @click="deleteShift">
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
      shift: this.$store.getters["planner/activeShift"].shift,
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
    };
  },
  computed: {
    showNewSuggestion() {
      if (
        this.shift.place != "" &&
        !this.$store.getters["settings/suggestions"]
          .map((sug) => {
            return sug.toLowerCase();
          })
          .includes(this.shift.place.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    switchHandler(selectedEmployee) {
      this.shift.employee = selectedEmployee;
    },
    setBreak(val) {
      if (val === "-") {
        this.shift.break = "0";
      } else {
        this.shift.break = val;
      }
    },
    clearError(field) {
      this.error[field] = false;
    },
    validateTime(time, field) {
      if (/^([0-9])$/.test(time)) {
        this.shift[field] = `0${time}:00`;
      } else if (/^([0-1][0-9]|2[0-3])$/.test(time)) {
        this.shift[field] = `${time}:00`;
      } else if (/^([0-1]?[0-9]|2[0-3])\D?([0-5][0-9])$/.test(time)) {
        this.shift[field] = `${time.slice(0, 2)}:${time.slice(-2)}`;
      } else {
        this.error[field] = true;
      }

      if (this.shift.start && this.shift.end) {
        const [startHour, startMin] = this.shift.start.split(":");
        const [endHour, endMin] = this.shift.end.split(":");

        const start = new Date();
        start.setHours(startHour);
        start.setMinutes(startMin);

        const end = new Date();
        end.setHours(endHour);
        end.setMinutes(endMin);

        if (end <= start && this.shift.end != "00:00") {
          this.error.end = true;
        } else {
          this.error.end = false;
        }
      }
    },
    selectSuggestion(suggestion) {
      this.shift.place = suggestion;
      this.shift.selectedSuggestion = suggestion;
    },
    saveEditShift() {
      const stringifyDate = (date) => {
        const [day, month, year] = date.split("-");
        return `${year}${month}${day}`;
      };

      const stringifyTime = (time) => {
        return time.replace(":", "");
      };

      if (this.$store.getters["planner/newShift"]) {
        this.$store.dispatch("planner/addNewShift", {
          employee: this.employee.id,
          place: this.place,
          date: stringifyDate(this.date),
          start: stringifyTime(this.start),
          end: stringifyTime(this.end),
          break: this.break,
          notes: this.notes,
        });
      } else {
        this.$store.dispatch("planner/saveEditShift", {
          employee: this.employee.id,
          place: this.place,
          date: stringifyDate(this.date),
          start: stringifyTime(this.start),
          end: stringifyTime(this.end),
          break: this.break,
          notes: this.notes,
        });
      }

      this.closeEditShift();
    },
    closeEditShift() {
      this.$store.dispatch("planner/setActiveShift", null);
      this.$store.dispatch("planner/newShift", null);
    },
    deleteShift() {
      this.$store.dispatch("planner/deleteShift");
      this.closeEditShift();
    },
  },
};
</script>
