<template>
  <base-modal class="edit-shift" :title="newShift ? 'New Shift' : 'Edit Shift'" globalClose @close="closeEditShift">
    <template v-slot:header>
      <base-badge
        :status="shift.accepted ? 'accepted' : 'not accepted yet'"
        class="active"
      ></base-badge>
    </template>
    <template v-slot:main>
      <div>
        <div class="form-control">
          <label for="name">{{ $t('general.labels.name') }}</label>
          <base-dropdown
            v-if="shift.employee.id || newShift"
            :error="error.employee"
            :items="employees"
            :active="shift.employee.id"
            @choice="dropdownHandler"
            enableSearch
            employeeStatus
          ></base-dropdown>
        </div>
        <div class="form-control">
          <label for="place">{{ $t('general.labels.place') }}</label>
          <div>
            <input
              autocomplete="off"
              type="text"
              :class="{ error: error.place }"
              id="place"
              v-model.trim="shift.place"
              @input="clearError('place')"
            />
            <div class="suggestions">
              <span
                v-for="suggestion in $store.getters['settings/suggestions']"
                :key="suggestion"
                :class="{ selected: this.selectedSuggestion === suggestion }"
                @click="selectSuggestion(suggestion)"
                @click.right="$store.dispatch('settings/deleteSuggestion', { event: $event, suggestion })"
                >{{ suggestion }}</span
              >
              <span
                class="add"
                v-if="showNewSuggestion"
                @click="$store.dispatch('settings/addSuggestion', { suggestion: shift.place })"
              >
                <span class="material-icons material-icons-round">add</span>
                {{ shift.place }}</span
              >
            </div>
          </div>
        </div>
        <div class="form-control">
          <label for="date">{{ $t('general.labels.date') }}</label>
          <div class="form-control-date">
            <BaseDatePicker
              :active="this.$store.getters['date/dates'][this.$store.getters['planner/activeShiftId'].day]"
              :error="error.date"
              @date="dateHandler"
            />
            <div class="form-control-time">
              <span class="input-label-main">{{ $t('general.labels.time') }}</span>
              <input
                autocomplete="off"
                type="text"
                :class="['time', { error: error.start }]"
                v-model.trim="shift.start"
                @blur="formatTime(shift.start, 'start')"
                @input="clearError('start')"
              />
              <span class="input-label">-</span>
              <input
                autocomplete="off"
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
          <label>{{ $t('general.labels.break') }}</label>
          <base-switch
            id="breaks"
            v-if="shift.break"
            :items="$store.getters['settings/breaks']"
            :active="shift.break"
            @activeItem="setBreak"
            :fixed="true"
          ></base-switch>
        </div>
        <div class="form-control notes">
          <label for="notes">{{ $t('general.labels.notes') }}</label>
          <textarea id="notes" v-model="shift.notes"></textarea>
        </div>
      </div>
    </template>
    <template v-slot:actions>
      <base-button
        v-if="!newShift"
        color="danger"
        iconOnly
        class="left"
        icon="delete"
        @click="deleteShift"
      ></base-button>
      <base-button secondary @click="closeEditShift">{{ $t('general.actions.cancel') }}</base-button>
      <base-button @click="validate">{{ $t('general.actions.save') }}</base-button>
    </template>
  </base-modal>

  <BaseConfirm
    ref="confirmReplaceShift"
    title="Shift already exists"
    message="This employee already has a shift on that day. Do you want to replace it?"
    choiceFalse="Go back"
    :choiceTrue="$t('general.actions.replace', {resource: 'shift'})"
  />

  <BaseConfirm
    ref="confirmDeleteShift"
    message="Deleting this shift cannot be undone."
    :choiceTrue="$t('general.actions.delete', {resource: 'shift'})"
  />
</template>

<script>
export default {
  data() {
    return {
      newShift: null,
      shift: {
        employee: {},
        place: '',
        date: '',
        start: '',
        end: '',
        break: '',
        notes: '',
      },
      error: {
        employee: false,
        place: false,
        date: false,
        start: false,
        end: false,
      },
      selectedSuggestion: null,
      showConfirmDelete: false,
    };
  },
  computed: {
    showNewSuggestion() {
      if (
        this.shift.place !== ''
        && !this.$store.getters['settings/suggestions']
          .map((sug) => sug.toLowerCase())
          .includes(this.shift.place.toLowerCase())
      ) {
        return true;
      }
      return false;
    },
    employees() {
      return this.$store.getters['employees/employees'].map((employee) => ({ id: employee.id, display: `${employee.firstName} ${employee.lastName}` }));
    },
  },
  methods: {
    dropdownHandler(selectedId) {
      this.error.employee = false;
      this.shift.employee = this.employees.find((emp) => emp.id === selectedId);
    },
    setBreak(val) {
      this.shift.break = val;
    },
    clearError(field) {
      this.error[field] = false;
    },
    formatTime(time, field) {
      if (/^\d{1,2}$/.test(time) && time < 24) {
        this.shift[field] = `${time.padStart(2, '0')}:00`;
      }
      if (/^\d{1,2}\D?[0-5][0-9]$/.test(time)) {
        this.shift[field] = `${time.slice(0, 2)}:${time.slice(-2)}`;
      }
    },
    dateHandler(date) {
      this.error.date = false;
      this.shift.date = date;
    },
    selectSuggestion(suggestion) {
      this.shift.place = suggestion;
      this.error.place = false;
      this.selectedSuggestion = suggestion;
    },
    validate() {
      // Validate field: employee
      if (this.shift.employee.id) {
        this.error.employee = false;
      } else {
        this.error.employee = true;
      }

      // Validate field: place
      if (this.shift.place) {
        this.error.place = false;
      } else {
        this.error.place = true;
      }

      // Validate field: date
      if (this.shift.date) {
        this.error.date = false;
      } else {
        this.error.date = true;
      }

      const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

      // Validate field: start
      if (timeRegex.test(this.shift.start)) {
        this.error.start = false;
      } else {
        this.error.start = true;
      }

      // Validate field: end
      if (timeRegex.test(this.shift.end)) {
        this.error.end = false;
      } else {
        this.error.end = true;
      }

      // Check if start is before end
      if (!this.error.start && !this.error.start) {
        const [startHour, startMin] = this.shift.start.split(':');
        const [endHour, endMin] = this.shift.end.split(':');

        const start = new Date();
        start.setHours(startHour);
        start.setMinutes(startMin);

        const end = new Date();
        end.setHours(endHour);
        end.setMinutes(endMin);

        if (end <= start && this.shift.end !== '00:00') {
          this.error.end = true;
        } else {
          this.error.end = false;
        }
      }

      if (!Object.values(this.error).includes(true)) {
        this.saveEditShift();
      }
    },
    async saveEditShift() {
      const employeeId = this.shift.employee.id;
      const weekId = await this.$store.dispatch('date/getWeekId', this.shift.date);
      const day = this.shift.date.getUTCDay();

      const shiftId = {
        employeeId,
        weekId,
        day,
      };

      // Helper function to check if target shiftId is equal to active shiftId
      const compareObjects = (obj1, obj2) => {
        for (const key in obj1) {
          if (obj1[key] !== obj2[key]) {
            return false;
          }
        }
        return true;
      };

      // If target shiftId already exists and is not active shiftId, ask for confirmation
      if (
        !compareObjects(shiftId, this.$store.getters['planner/activeShiftId'])
        && this.$store.getters['planner/schedules'][weekId]
        && this.$store.getters['planner/schedules'][weekId][employeeId]
        && this.$store.getters['planner/schedules'][weekId][employeeId][day]
      ) {
        // If user doesn't confirm, don't save current shift
        if (!(await this.$refs.confirmReplaceShift.open())) {
          return;
        }
      }

      // Save shift and exit modal
      const stringifyTime = (time) => time.replace(':', '');

      const shiftInfo = {
        place: this.shift.place,
        start: stringifyTime(this.shift.start),
        end: stringifyTime(this.shift.end),
        break: this.shift.break,
        notes: this.shift.notes || '',
      };

      this.$store.dispatch('planner/saveEditShift', { shiftId, shiftInfo });
      this.closeEditShift();
    },
    closeEditShift() {
      this.$store.dispatch('planner/setActiveShiftId', null);
    },
    async deleteShift() {
      if (await this.$refs.confirmDeleteShift.open()) {
        this.$store.dispatch('planner/deleteShift');
        this.closeEditShift();
      }
    },
  },
  async mounted() {
    const activeShiftId = this.$store.getters['planner/activeShiftId'];

    this.newShift = true;
    this.shift.break = '0';

    // Helper functions
    const parseTime = (time) => `${time.substring(0, 2)}:${time.substring(2, 4)}`;

    if (activeShiftId !== 'new') {
      if (!activeShiftId.employeeId) {
        this.shift.date = this.$store.getters['date/dates'][activeShiftId.day];
      } else {
        // Get info for selected shift
        const { weekId, day, employeeId } = activeShiftId;

        const shift = this.$store.getters['planner/schedules'][weekId][employeeId][day];
        const employee = this.$store.getters['employees/employees'].find((emp) => emp.id === employeeId);

        // Set boilerplate shift info
        this.shift.employee = {
          fullName: `${employee.firstName} ${employee.lastName}`,
          id: employeeId,
        };
        this.shift.date = this.$store.getters['date/dates'][day];

        // If active shift exists, set shift info
        if (shift) {
          this.newShift = false;

          this.shift.place = shift.place;
          this.shift.start = parseTime(shift.start);
          this.shift.end = parseTime(shift.end);
          this.shift.notes = shift.notes;
          this.shift.break = shift.break;
          this.shift.accepted = shift.accepted;
        }
      }
    }
  },
};
</script>
