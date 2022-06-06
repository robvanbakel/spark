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
            v-if="shift.employeeId || (newShift && !initState?.employeeId)"
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
              v-if="shift.from || (newShift && !$store.getters['planner/newShiftPrefillData']?.from)"
              :active="shift.from ? shift.from : null"
              :error="error.date"
              @date="formatDateTime($event, 'date', 'inputDate')"
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
            :active="shift.break"
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
      <base-button v-if="newRequestNeeded && !newShift" secondary @click="resetForm">Reset</base-button>
      <base-button v-else secondary @click="closeEditShift">{{ $t('general.actions.cancel') }}</base-button>
      <base-button @click="validate">{{ newRequestNeeded ? 'Send request' : $t('general.actions.save') }}</base-button>
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
import util from '@/utils/util';

export default {
  data() {
    return {
      inputDate: '',
      inputFrom: '',
      inputTo: '',
      shift: {},
      changed: {},
      error: {},
      requiredFields: ['employee', 'location', 'date', 'from', 'to'],
      selectedSuggestion: null,
      showConfirmDelete: false,
    };
  },
  computed: {
    showNewSuggestion() {
      if (
        this.shift.location && !this.$store.getters['settings/suggestions']
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
    newShift() {
      return this.$store.getters['planner/activeShiftId'] === 'NEW';
    },
    initState() {
      return this.$store.getters['planner/shifts'].find((v) => v.id === this.$store.getters['planner/activeShiftId']) || this.$store.getters['planner/newShiftPrefillData'];
    },
    newRequestNeeded() {
      return this.newShift || this.changed.employee || this.changed.from || this.changed.to;
    },
  },
  methods: {
    dropdownHandler(selectedId) {
      this.error.employee = false;
      this.shift.employeeId = selectedId;

      if (this.newShift) return;
      this.changed.employee = this.initState.employeeId !== selectedId;
    },
    setBreak(val) {
      this.shift.break = val;
    },
    clearError(field) {
      this.error[field] = false;
    },
    async resetForm() {
      this.shift = {};
      this.changed = {};
      this.requiredFields.forEach((field) => this.clearError(field));
      await this.$nextTick();
      this.setInitState();
    },
    setInitState() {
      this.shift = { break: '0', ...this.initState };
      this.inputDate = this.shift.from;

      if (this.newShift) return;

      this.inputFrom = this.shift.from.format('HH:mm');
      this.inputTo = this.shift.to.format('HH:mm');
    },
    formatDateTime(value, field, model) {
      if (!this.shift.from) this.shift.from = this.$dayjs();
      if (!this.shift.to) this.shift.to = this.$dayjs();

      if (field === 'date') {
        const year = value.year();
        const month = value.month();
        const date = value.date();

        this.error.date = false;
        this.inputDate = value;
        this.shift.from = this.shift.from.year(year).month(month).date(date);
        this.shift.to = this.shift.to.year(year).month(month).date(date);
      } else {
        if (/^\d{1,2}$/.test(value) && value < 24) {
          this.shift[field] = this.$dayjs(this.shift[field]).hour(value).minute(0);
        } else {
          try {
            const [, hour, minute] = value.match(/^(\d{1,2}?)\D?(\d{1,2})?$/);
            this.shift[field] = this.$dayjs(this.shift[field]).hour(hour < 24 ? hour : 0).minute(minute < 60 ? minute : 0);
          } catch {
            if (this.shift[model]) {
              this.error[field] = true;
            }
            return;
          }
        }
        this[model] = this.$dayjs(this.shift[field]).format('HH:mm');
      }

      if (this.newShift) return;
      this.changed.from = !this.initState.from.isSame(this.shift.from, 'minute');
      this.changed.to = !this.initState.to.isSame(this.shift.to, 'minute');
    },
    selectSuggestion(suggestion) {
      this.shift.location = suggestion;
      this.error.location = false;
      this.selectedSuggestion = suggestion;
    },
    validate() {
      this.error.employee = !this.shift.employeeId;
      this.error.location = !this.shift.location;
      this.error.date = !this.inputDate;
      this.error.from = !this.inputFrom;
      this.error.to = !this.inputTo;

      if (!this.error.from && !this.error.to) {
        this.error.to = this.shift.to.isBefore(this.shift.from) && this.inputTo !== '00:00';
      }

      if (Object.values(this.error).includes(true)) return;

      this.saveEditShift();
    },
    async saveEditShift() {
      if (this.newShift) {
        this.shift.status = 'NEW';
        this.shift.id = util.randomId(20);
        this.shift.statusUpdated = new Date().toISOString();
      }

      // If employee already has a shift on that day, confirm that the shift should be replaced
      const collision = this.$store.getters['planner/shifts'].find((shift) => shift.id !== this.shift.id && shift.employeeId === this.shift.employeeId && shift.from.isSame(this.shift.from, 'date'));
      if (collision) {
        if (!(await this.$refs.confirmReplaceShift.open())) return;
        this.$store.dispatch('planner/deleteShiftLocally', collision.id);
      }

      // Save shift and exit modal
      this.$store.dispatch('planner/saveEditShift', this.shift);
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
  mounted() {
    this.resetForm();
  },
};
</script>
