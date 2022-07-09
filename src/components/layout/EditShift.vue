<script setup>
import {
  ref, onMounted, computed, nextTick,
} from 'vue';

import util from '@/utils/util';
import dayjs from '@/plugins/dayjs';

import { useStore } from 'vuex';

const store = useStore();

const confirmDeleteShift = ref();
const confirmReplaceShift = ref();
const suggestionRightClickMenu = ref();
const inputFrom = ref('');
const inputTo = ref('');
const shift = ref({});
const changed = ref({});
const error = ref({});
const requiredFields = ref(['employee', 'location', 'date', 'from', 'to']);
const selectedSuggestion = ref(null);

const showNewSuggestion = computed(() => {
  if (
    shift.value.location && !store.getters['settings/settings'].suggestions
      .map((sug) => sug.toLowerCase())
      .includes(shift.value.location.toLowerCase())
  ) {
    return true;
  }
  return false;
});

const employees = computed(() => store.getters['employees/employees'].map((employee) => ({ id: employee.id, display: `${employee.firstName} ${employee.lastName}` })));

const newShift = computed(() => store.getters['planner/activeShiftId'] === 'NEW');

const initState = computed(() => store.getters['planner/shifts'].find((v) => v.id === store.getters['planner/activeShiftId']) || store.getters['planner/newShiftPrefillData']);

const newRequestNeeded = computed(() => changed.value.employee || changed.value.from || changed.value.to);

onMounted(() => {
  resetForm();
});

const dropdownHandler = (selectedId) => {
  error.value.employee = false;
  shift.value.employeeId = selectedId;

  if (newShift.value) return;
  changed.value.employee = initState.value.employeeId !== selectedId;
};

const clearError = (field) => {
  error.value[field] = false;
};

const resetForm = async () => {
  shift.value = {};
  changed.value = {};
  requiredFields.value.forEach((field) => clearError(field));
  await nextTick();
  setInitState();
};

const setInitState = () => {
  shift.value = { break: '0', ...initState.value };

  if (newShift.value) return;

  inputFrom.value = shift.value.from.format('HH:mm');
  inputTo.value = shift.value.to.format('HH:mm');
};

const formatDateTime = (value, field, model) => {
  if (/^\d{1,2}$/.test(value) && value < 24) {
    shift.value[field] = dayjs(shift.value[field]).hour(value).minute(0);
  } else {
    try {
      const [, hour, minute] = value.match(/^(\d{1,2}?)\D?(\d{1,2})?$/);
      shift.value[field] = dayjs(shift.value[field]).hour(hour < 24 ? hour : 0).minute(minute < 60 ? minute : 0);
    } catch {
      error.value[field] = model;
      return;
    }
  }

  const formattedTime = dayjs(shift.value[field]).format('HH:mm');

  switch (model) {
    case 'inputFrom':
      inputFrom.value = formattedTime;
      break;
    case 'inputTo':
      inputTo.value = formattedTime;
      break;
    default:
      break;
  }

  shiftToTime();

  if (newShift.value) return;

  changed.value.from = !initState.value.from.isSame(shift.value.from, 'minute');
  changed.value.to = !initState.value.to.isSame(shift.value.to, 'minute');
};

const shiftToTime = () => {
  if (!shift.value.from || !shift.value.to) return;

  shift.value.to = shift.value.from
    .hour(shift.value.to.hour())
    .minute(shift.value.to.minute());

  if (shift.value.to.isBefore(shift.value.from) || inputTo.value === '00:00') {
    shift.value.to = shift.value.to.add(1, 'day');
  }
};

const selectSuggestion = (suggestion) => {
  shift.value.location = suggestion;
  error.value.location = false;
};

const deleteSuggestion = (suggestion) => {
  store.dispatch('settings/deleteSuggestion', suggestion);
};

const suggestionRightClickHandler = async (event, suggestion) => {
  selectedSuggestion.value = suggestion;
  await suggestionRightClickMenu.value.open(event, suggestion);
  selectedSuggestion.value = null;
};

const validate = () => {
  error.value.employee = !shift.value.employeeId;
  error.value.location = !shift.value.location;
  error.value.from = !inputFrom.value;
  error.value.to = !inputTo.value || shift.value.from.isSame(shift.value.to);

  if (Object.values(error.value).includes(true)) return;

  saveEditShift();
};

const saveEditShift = async () => {
  if (newShift.value) {
    shift.value.status = 'NEW';
    shift.value.id = util.randomId(20);
    shift.value.statusUpdated = new Date().toISOString();
  }

  // If employee already has a shift on that day, confirm that the shift should be replaced
  const collision = store.getters['planner/shifts'].find((v) => v.id !== shift.value.id && v.employeeId === shift.value.employeeId && v.from.isSame(shift.value.from, 'date'));
  if (collision) {
    if (!(await confirmReplaceShift.value.open())) return;
    store.dispatch('planner/deleteShiftLocally', collision.id);
  }

  // Save shift and exit modal
  store.dispatch('planner/saveEditShift', {
    ...shift.value,
    status: newRequestNeeded.value ? 'PROPOSED' : shift.value.status,
  });
  closeEditShift();
};

const closeEditShift = () => {
  store.dispatch('planner/setActiveShiftId', null);
};

const deleteShift = async () => {
  if (await confirmDeleteShift.value.open()) {
    store.dispatch('planner/deleteShift');
    closeEditShift();
  }
};
</script>

<template>
  <base-modal
    class="edit-shift"
    :title="newShift ? 'New Shift' : 'Edit Shift'"
    global-close
    @close="closeEditShift"
  >
    <template #header>
      <base-badge
        v-if="!newShift"
        :status="shift.status === 'ACCEPTED' ? 'accepted' : 'not accepted yet'"
        class="active"
      />
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
            enable-search
            employee-status
            @choice="dropdownHandler"
          />
        </div>
        <div class="form-control">
          <label for="location">{{ $t('general.labels.location') }}</label>
          <div>
            <input
              id="location"
              v-model.trim="shift.location"
              autocomplete="off"
              type="text"
              :class="{ error: error.location }"
              @input="clearError('location')"
            >
            <div class="suggestions">
              <span
                v-for="suggestion in store.getters['settings/settings'].suggestions"
                :key="suggestion"
                :class="{ selected: selectedSuggestion === suggestion }"
                @click="selectSuggestion(suggestion)"
                @click.right.prevent="suggestionRightClickHandler($event, suggestion)"
              >{{ suggestion }}</span>
              <span
                v-if="showNewSuggestion"
                class="add"
                @click="store.dispatch('settings/addSuggestion', shift.location)"
              >
                <span class="material-icons material-icons-round">add</span>
                {{ shift.location }}</span>
            </div>
          </div>
        </div>
        <div class="form-control">
          <label for="date">{{ $t('general.labels.date') }}</label>
          <div class="form-control-date">
            <BaseDatePicker
              v-model="shift.from"
              :error="error.date"
              @update:model-value="shiftToTime"
            />
            <div class="form-control-time">
              <span class="input-label-main">{{ $t('general.labels.time') }}</span>
              <input
                v-model.lazy.trim="inputFrom"
                autocomplete="off"
                type="text"
                :class="['time', { error: error.from }]"
                @change="formatDateTime(inputFrom, 'from', 'inputFrom')"
                @input="clearError('from')"
              >
              <span class="input-label">-</span>
              <input
                v-model.lazy.trim="inputTo"
                autocomplete="off"
                type="text"
                :class="['time', { error: error.to }]"
                @change="formatDateTime(inputTo, 'to', 'inputTo')"
                @input="clearError('to')"
              >
            </div>
          </div>
        </div>
        <div class="form-control">
          <label>{{ $t('general.labels.break') }}</label>
          <BaseSwitch
            v-model="shift.break"
            :items="store.getters['settings/breaks']"
            fixed
            tabindex="0"
          />
        </div>
        <div class="form-control notes">
          <label for="notes">{{ $t('general.labels.notes') }}</label>
          <textarea
            id="notes"
            v-model="shift.notes"
          />
        </div>
      </div>
    </template>
    <template #actions>
      <base-button
        v-if="!newShift"
        color="danger"
        icon-only
        class="left"
        icon="delete"
        tabindex="-1"
        @click="deleteShift"
      />
      <base-button
        v-if="newRequestNeeded && !newShift"
        secondary
        @click="resetForm"
      >
        Reset
      </base-button>
      <base-button
        v-else
        secondary
        @click="closeEditShift"
      >
        {{ $t('general.actions.cancel') }}
      </base-button>
      <base-button @click="validate">
        {{ newShift || newRequestNeeded ? 'Send request' : $t('general.actions.save') }}
      </base-button>
    </template>
  </base-modal>

  <RightClickMenu
    ref="suggestionRightClickMenu"
    :items="[
      {
        icon: 'delete',
        label: 'Delete',
        action: deleteSuggestion,
      },
    ]"
  />

  <BaseConfirm
    ref="confirmReplaceShift"
    title="Shift already exists"
    message="This employee already has a shift on that day. Do you want to replace it?"
    choice-false="Go back"
    :choice-true="$t('general.actions.replace', {resource: 'shift'})"
  />

  <BaseConfirm
    ref="confirmDeleteShift"
    message="Deleting this shift cannot be undone."
    :choice-true="$t('general.actions.delete', {resource: 'shift'})"
  />
</template>
