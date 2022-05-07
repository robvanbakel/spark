<template>
  <base-modal class="edit-shift" :title="newShift ? 'New Shift' : 'Edit Shift'" globalClose @close="closeEditShift">
    <template #header>
      <base-badge
        v-if="!newShift"
        :status="shift.status === 'ACCEPTED' ? 'accepted' : 'not accepted yet'"
        class="active"
      ></base-badge>
    </template>
    <template #main>
      <div>
        <div class="form-control">
          <label for="name">{{ $t('general.labels.name') }}</label>
          <base-dropdown
            v-if="shift.employeeId || newShift"
            id="name"
            :error="error.employee"
            :items="employees"
            :active="shift.employeeId"
            @choice="dropdownHandler"
            enableSearch
            employeeStatus
          ></base-dropdown>
        </div>
        <div class="form-control">
          <label for="location">{{ $t('general.labels.location') }}</label>
          <div>
            <input
              autocomplete="off"
              type="text"
              :class="{ error: error.location }"
              id="location"
              v-model.trim="shift.location"
              @input="clearError('location')"
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
                @click="$store.dispatch('settings/addSuggestion', { suggestion: shift.location })"
              >
                <span class="material-icons material-icons-round">add</span>
                {{ shift.location }}</span
              >
            </div>
          </div>
        </div>
        <div class="form-control">
          <label for="date">{{ $t('general.labels.date') }}</label>
          <div class="form-control-date">
            <BaseDatePicker
              v-if="shift.from"
              :active="$dayjs(shift.from)"
              :error="error.date"
              @date="formatDateTime($event, 'date')"
            />
            <div class="form-control-time">
              <span class="input-label-main">{{ $t('general.labels.time') }}</span>
              <input
                autocomplete="off"
                type="text"
                :class="['time', { error: error.from }]"
                v-model.trim="inputFrom"
                @change="formatDateTime(inputFrom, 'from', 'inputFrom')"
                @input="clearError('from')"
              />
              <span class="input-label">-</span>
              <input
                autocomplete="off"
                type="text"
                :class="['time', { error: error.to }]"
                v-model.trim="inputTo"
                @change="formatDateTime(inputTo, 'to', 'inputTo')"
                @input="clearError('to')"
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
            :active="shift.break.toString()"
            @activeItem="setBreak"
            :fixed="true"
            tabindex="0"
          ></base-switch>
        </div>
        <div class="form-control notes">
          <label for="notes">{{ $t('general.labels.notes') }}</label>
          <textarea id="notes" v-model="shift.notes"></textarea>
        </div>
      </div>
    </template>
    <template #actions>
      <base-button
        v-if="!newShift"
        color="danger"
        iconOnly
        class="left"
        icon="delete"
        tabindex="-1"
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

  <BaseConfirm
    ref="resendAcceptRequest"
    title="New acceptance needed"
    message="A new request to accept this shift will be sent to the employee."
    choiceFalse="Go back"
    choiceTrue="Send request"
  />
</template>

<script>
export default {
  data() {
    return {
      newShift: null,
      inputFrom: '',
      inputTo: '',
      shift: {
        employee: {},
        location: '',
        date: '',
        from: '',
        to: '',
        break: '',
        notes: '',
      },
      error: {
        employee: false,
        location: false,
        date: false,
        from: false,
        to: false,
      },
      selectedSuggestion: null,
      showConfirmDelete: false,
    };
  },
  computed: {
    showNewSuggestion() {
      if (
        this.shift.location !== ''
        && !this.$store.getters['settings/suggestions']
          .map((sug) => sug.toLowerCase())
          .includes(this.shift.location.toLowerCase())
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
    formatDateTime(value, field, model) {
      if (field === 'date') {
        const year = value.year();
        const month = value.month();
        const date = value.date();

        this.shift.from = this.$dayjs(this.shift.from).date(date).month(month).year(year);
        this.shift.to = this.$dayjs(this.shift.to).date(date).month(month).year(year);
      } else {
        if (/^\d{1,2}$/.test(value) && value < 24) {
          this.shift[field] = this.$dayjs(this.shift[field]).hour(value).minute(0);
        } else if (/^\d{1,2}\D?[0-5][0-9]$/.test(value)) {
          const [hour, minute] = value.split(/\D/);
          this.shift[field] = this.$dayjs(this.shift[field]).hour(hour).minute(minute);
        }
        this[model] = this.$dayjs(this.shift[field]).format('HH:mm');
      }
    },
    dateHandler(date) {
      this.error.date = false;
      this.shift.from = date;
      this.shift.to = date;
    },
    selectSuggestion(suggestion) {
      this.shift.location = suggestion;
      this.error.location = false;
      this.selectedSuggestion = suggestion;
    },
    validate() {
      // Validate field: employee
      if (this.shift.employee.id) {
        this.error.employee = false;
      } else {
        this.error.employee = true;
      }

      // Validate field: location
      if (this.shift.location) {
        this.error.location = false;
      } else {
        this.error.location = true;
      }

      // Validate field: date
      if (this.shift.date) {
        this.error.date = false;
      } else {
        this.error.date = true;
      }

      const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;

      // Validate field: from
      if (timeRegex.test(this.shift.from)) {
        this.error.from = false;
      } else {
        this.error.from = true;
      }

      // Validate field: to
      if (timeRegex.test(this.shift.to)) {
        this.error.to = false;
      } else {
        this.error.to = true;
      }

      // Check if from is before to
      // if (!this.error.start && !this.error.start) {
      //   const [startHour, startMin] = this.shift.start.split(':');
      //   const [endHour, endMin] = this.shift.end.split(':');

      //   const start = new Date();
      //   start.setHours(startHour);
      //   start.setMinutes(startMin);

      //   const end = new Date();
      //   end.setHours(endHour);
      //   end.setMinutes(endMin);

      //   if (end <= start && this.shift.end !== '00:00') {
      //     this.error.end = true;
      //   } else {
      //     this.error.end = false;
      //   }
      // }

      if (!Object.values(this.error).includes(true)) {
        this.saveEditShift();
      }
    },
    async saveEditShift() {
      const employeeId = this.shift.employee.id;
      const weekId = this.$dayjs(this.shift.date).weekId();
      const day = this.$dayjs(this.shift.date).isoWeekday() - 1;

      const shiftId = {
        employeeId,
        weekId,
        day,
      };

      // Helper function to check if target shiftId is equal to active shiftId
      const compareObjects = (obj1, obj2) => {
        // eslint-disable-next-line no-restricted-syntax
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

      // If employee, date, start or end time changed, inform the employer
      // that a new acceptance notification will be sent
      if (!this.newShift) {
        const oldShiftId = this.$store.getters['planner/activeShiftId'];

        const oldShift = this.$store.getters['planner/schedules'][oldShiftId.weekId][oldShiftId.employeeId][oldShiftId.day];
        const newShift = this.shift;

        if (oldShiftId.weekId !== newShift.date.weekId()
      || oldShiftId.day !== newShift.date.isoWeekday() - 1
      || oldShiftId.employeeId !== newShift.employee.id
      || oldShift.from !== newShift.from.replace(':', '')
      || oldShift.to !== newShift.to.replace(':', '')) {
          if (!(await this.$refs.resendAcceptRequest.open())) {
            return;
          }
          this.shift.accepted = false;
        }
      }

      // Save shift and exit modal
      const stringifyTime = (time) => time.replace(':', '');

      const shiftInfo = {
        location: this.shift.location,
        from: stringifyTime(this.shift.from),
        to: stringifyTime(this.shift.to),
        break: this.shift.break,
        notes: this.shift.notes || '',
        accepted: this.shift.accepted,
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
    // this.newShift = true;
    // this.shift.break = '0';
    const shift = this.$store.getters['planner/shifts'].find((v) => v.shiftId === this.$store.getters['planner/activeShiftId']);

    this.shift = shift;
    this.inputFrom = this.$dayjs(shift.from).format('HH:mm');
    this.inputTo = this.$dayjs(shift.to).format('HH:mm');

    // if (activeShiftId !== 'new') {
    //   if (!activeShiftId.employeeId) {
    //     this.shift.date = this.$store.getters['date/dates'][activeShiftId.day];
    //   } else {
    //     // Get info for selected shift
    //     const { weekId, day, employeeId } = activeShiftId;

    //     const shift = this.$store.getters['planner/schedules'][weekId][employeeId][day];
    //     const employee = this.$store.getters['employees/employees'].find((emp) => emp.id === employeeId);

    //     // Set boilerplate shift info
    //     this.shift.employee = {
    //       fullName: `${employee.firstName} ${employee.lastName}`,
    //       id: employeeId,
    //     };
    //     this.shift.date = this.$store.getters['date/dates'][day];

    //     // If active shift exists, set shift info
    //     if (shift) {
    //       this.newShift = false;

    //       this.shift.place = shift.place;
    //       this.shift.start = parseTime(shift.start);
    //       this.shift.end = parseTime(shift.end);
    //       this.shift.notes = shift.notes;
    //       this.shift.break = shift.break;
    //       this.shift.accepted = shift.accepted;
    //       this.shift.shiftId = shift.shiftId;
    //     }
    //   }
    // }
  },
};
</script>
