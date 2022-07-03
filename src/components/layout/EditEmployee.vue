<script setup>
import {
  ref, computed, onMounted, nextTick,
} from 'vue';

import util from '@/utils/util';
import StatusPicker from '@/components/ui/StatusPicker.vue';

import { useStore } from 'vuex';

const store = useStore();

const emailAlreadyExists = ref();
const somethingWentWrong = ref();
const confirmDeleteEmployee = ref();
const employee = ref({});
const error = ref({});
const requiredFields = ref(['firstName', 'lastName', 'role', 'contract', 'email']);

const roles = computed(() => store.getters['settings/settings'].roles.map((role) => ({ id: role, display: role })));

const newUser = computed(() => store.getters['employees/activeUserId'] === 'NEW');

const initState = computed(() => store.getters['employees/users'].find((v) => v.id === store.getters['employees/activeUserId']));

onMounted(() => {
  resetForm();
});

const setActiveStatus = (status) => {
  employee.value.status = status;
};

const resetForm = async () => {
  employee.value = {};
  requiredFields.value.forEach((field) => clearError(field));
  await nextTick();
  setInitState();
};

const setInitState = () => {
  employee.value = { ...initState.value };
};

const setRole = (value) => {
  clearError('role');
  employee.value.role = value;
};

const closeEditEmployee = () => {
  store.dispatch('employees/activeUserId', null);
};

const deleteEmployee = async () => {
  if (await confirmDeleteEmployee.value.open()) {
    employee.value.status = 'ARCHIVED';
    saveEditUser();
  }
};

const validate = () => {
  if (newUser.value) {
    error.value.firstName = !employee.value.firstName;
    error.value.lastName = !employee.value.lastName;
  }

  employee.value.contract = parseFloat(employee.value.contract.toString().replace(',', '.'));

  error.value.role = !employee.value.role;
  error.value.contract = !employee.value.contract;

  error.value.email = !/^.+@\w+\.\w+$/i.test(employee.value.email);

  if (Object.values(error.value).includes(true)) return;

  saveEditUser();
};

const saveEditUser = async () => {
  if (newUser.value) {
    employee.value.status = 'NEW';
    employee.value.id = util.randomId(28);
  }

  try {
    await store.dispatch('employees/saveEditUser', employee.value);
    closeEditEmployee();
  } catch (err) {
    if (err.code === 'auth/email-already-exists') {
      error.value.email = true;
      emailAlreadyExists.value.open();
      return;
    }

    somethingWentWrong.value.open();
  }
};

const clearError = (field) => {
  error.value[field] = false;
};
</script>

<template>
  <base-modal
    class="edit-employee"
    global-close
    @close="closeEditEmployee"
  >
    <template #header>
      <h1 v-if="newUser">
        {{ $t('general.actions.add', { resource: 'Employee' }) }}
      </h1>
      <h1 v-else>
        {{ employee.firstName }} {{ employee.lastName }}
      </h1>
      <StatusPicker
        v-if="!newUser && employee.status"
        :active-status="employee.status"
        @set-active-status="setActiveStatus"
      />
    </template>
    <template #main>
      <div v-if="newUser">
        <div class="form-control">
          <label for="firstName">{{ $t('general.labels.firstName') }}</label>
          <input
            id="firstName"
            v-model.trim="employee.firstName"
            autocomplete="off"
            type="text"
            :class="{ error: error.firstName }"
            @input="clearError('firstName')"
          >
        </div>
        <div class="form-control">
          <label for="lastName">{{ $t('general.labels.lastName') }}</label>
          <input
            id="lastName"
            v-model.trim="employee.lastName"
            autocomplete="off"
            type="text"
            :class="{ error: error.lastName }"
            @input="clearError('lastName')"
          >
        </div>
      </div>
      <div class="form-control">
        <label for="role">{{ $t('general.labels.role') }}</label>
        <base-dropdown
          v-if="employee.role || newUser"
          id="role"
          :items="roles"
          :active="employee.role"
          :error="error.role"
          @choice="setRole"
        />
      </div>
      <div class="form-control">
        <label for="contract">{{ $t('general.labels.contract') }}</label>
        <div class="form-control-contract">
          <div>
            <input
              id="contract"
              v-model.trim="employee.contract"
              autocomplete="off"
              type="text"
              :class="{ error: error.contract }"
              @input="clearError('contract')"
            >
            <span class="input-label">{{ $t('staff.hours') }}</span>
          </div>
          <BaseSwitch
            v-model="employee.contractType"
            :items="['fulltime', 'parttime']"
          />
        </div>
      </div>
      <div class="form-control">
        <label for="email">{{ $t('general.labels.email') }}</label>
        <input
          id="email"
          v-model.trim="employee.email"
          autocomplete="off"
          type="text"
          :class="{ error: error.email }"
          @input="clearError('email')"
        >
      </div>
      <div class="form-control">
        <label for="phone">{{ $t('general.labels.phone') }}</label>
        <input
          id="phone"
          v-model.trim="employee.phone"
          autocomplete="off"
          type="text"
        >
      </div>
      <div class="form-control notes">
        <label for="notes">{{ $t('general.labels.notes') }}</label>
        <textarea
          id="notes"
          v-model="employee.notes"
        />
      </div>
    </template>
    <template #actions>
      <base-button
        v-if="!newUser"
        color="danger"
        icon-only
        icon="delete"
        class="left"
        tabindex="-1"
        @click="deleteEmployee"
      />
      <base-button
        secondary
        @click="closeEditEmployee"
      >
        {{ $t('general.actions.cancel') }}
      </base-button>
      <base-button @click="validate">
        {{ $t('general.actions.save') }}
      </base-button>
    </template>
  </base-modal>

  <BaseConfirm
    ref="confirmDeleteEmployee"
    message="Deleting an employee cannot be undone."
    :choice-true="$t('general.actions.delete', {resource: 'employee'})"
  />

  <BaseConfirm
    ref="emailAlreadyExists"
    title="Email already in use"
    message="This email address is already associated with an employee."
    choice-true="Go back"
    no-false
  />

  <BaseConfirm
    ref="somethingWentWrong"
    title="Something went wrong"
    message="Something went wrong trying to create this employee."
    choice-true="Try again"
    no-false
  />
</template>
