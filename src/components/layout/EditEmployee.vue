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
          <base-switch
            id="contractType"
            :items="['fulltime', 'parttime']"
            :active="employee.contractType"
            @active-item="setContractType"
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

<script>
import util from '@/utils/util';
import StatusPicker from '@/components/ui/StatusPicker.vue';

export default {
  components: {
    StatusPicker,
  },
  data() {
    return {
      employee: {},
      changed: {},
      error: {},
      requiredFields: ['firstName', 'lastName', 'role', 'contract', 'email'],
      showConfirmDelete: false,
    };
  },
  computed: {
    roles() {
      return this.$store.getters['settings/settings'].roles.map((role) => ({ id: role, display: role }));
    },
    newUser() {
      return this.$store.getters['employees/activeUserId'] === 'NEW';
    },
    initState() {
      return this.$store.getters['employees/users'].find((v) => v.id === this.$store.getters['employees/activeUserId']);
    },
  },
  mounted() {
    this.resetForm();
  },
  methods: {
    setActiveStatus(status) {
      this.employee.status = status;
    },
    async resetForm() {
      this.employee = {};
      this.requiredFields.forEach((field) => this.clearError(field));
      await this.$nextTick();
      this.setInitState();
    },
    setInitState() {
      this.employee = { ...this.initState };
    },
    setContractType(value) {
      this.employee.contractType = value;
    },
    setRole(value) {
      this.clearError('role');
      this.employee.role = value;
    },
    closeEditEmployee() {
      this.$store.dispatch('employees/activeUserId', null);
    },
    async deleteEmployee() {
      if (await this.$refs.confirmDeleteEmployee.open()) {
        this.employee.status = 'ARCHIVED';
        this.saveEditUser();
      }
    },
    validate() {
      if (this.newUser) {
        this.error.firstName = !this.employee.firstName;
        this.error.lastName = !this.employee.lastName;
      }

      this.employee.contract = parseFloat(this.employee.contract.toString().replace(',', '.'));

      this.error.role = !this.employee.role;
      this.error.contract = !this.employee.contract;

      this.error.email = !/^.+@\w+\.\w+$/i.test(this.employee.email);

      if (Object.values(this.error).includes(true)) return;

      this.saveEditUser();
    },
    async saveEditUser() {
      if (this.newUser) {
        this.employee.status = 'NEW';
        this.employee.id = util.randomId(28);
      }

      try {
        await this.$store.dispatch('employees/saveEditUser', this.employee);
        this.closeEditEmployee();
      } catch (err) {
        if (err.code === 'auth/email-already-exists') {
          this.error.email = true;
          this.$refs.emailAlreadyExists.open();
          return;
        }

        this.$refs.somethingWentWrong.open();
      }
    },
    clearError(field) {
      this.error[field] = false;
    },
  },
};
</script>
