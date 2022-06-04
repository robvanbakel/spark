<template>
  <base-modal class="edit-employee" globalClose @close="closeEditEmployee">
    <template #header>
      <h1 v-if="this.newUser">{{ $t('general.actions.add', { resource: 'Employee' }) }}</h1>
      <h1 v-else>{{ employee.firstName }} {{ employee.lastName }}</h1>
      <StatusPicker
        v-if="!this.newUser && employee.status"
        :activeStatus="employee.status"
        @setActiveStatus="setActiveStatus"
      />
    </template>
    <template #main>
      <div v-if="this.newUser">
        <div class="form-control">
          <label for="firstName">{{ $t('general.labels.firstName') }}</label>
          <input
            autocomplete="off"
            type="text"
            id="firstName"
            @input="clearError('firstName')"
            :class="{ error: error.firstName }"
            v-model.trim="employee.firstName"
          />
        </div>
        <div class="form-control">
          <label for="lastName">{{ $t('general.labels.lastName') }}</label>
          <input
            autocomplete="off"
            type="text"
            id="lastName"
            @input="clearError('lastName')"
            :class="{ error: error.lastName }"
            v-model.trim="employee.lastName"
          />
        </div>
      </div>
      <div class="form-control">
        <label for="role">{{ $t('general.labels.role') }}</label>
        <base-dropdown
          v-if="employee.role || this.newUser"
          id="role"
          :items="roles"
          :active="employee.role"
          :error="error.role"
          @choice="setRole"
        ></base-dropdown>
      </div>
      <div class="form-control">
        <label for="contract">{{ $t('general.labels.contract') }}</label>
        <div class="form-control-contract">
          <div>
            <input
              autocomplete="off"
              type="text"
              id="contract"
              @input="clearError('contract')"
              :class="{ error: error.contract }"
              v-model.trim="employee.contract"
            />
            <span class="input-label">{{ $t('staff.hours') }}</span>
          </div>
          <base-switch
            :items="['fulltime', 'parttime']"
            id="contractType"
            :active="employee.contractType"
            @active-item="setContractType"
          ></base-switch>
        </div>
      </div>
      <div class="form-control">
        <label for="email">{{ $t('general.labels.email') }}</label>
        <input
          autocomplete="off"
          type="text"
          id="email"
          @input="clearError('email')"
          :class="{ error: error.email }"
          v-model.trim="employee.email"
        />
      </div>
      <div class="form-control">
        <label for="phone">{{ $t('general.labels.phone') }}</label>
        <input autocomplete="off" type="text" id="phone" v-model.trim="employee.phone" />
      </div>
      <div class="form-control notes">
        <label for="notes">{{ $t('general.labels.notes') }}</label>
        <textarea id="notes" v-model="employee.notes"></textarea>
      </div>
    </template>
    <template #actions>
      <base-button
        v-if="!this.newUser"
        color="danger"
        iconOnly
        icon="delete"
        class="left"
        @click="deleteEmployee"
        tabindex="-1"
      ></base-button>
      <base-button secondary @click="closeEditEmployee">{{ $t('general.actions.cancel') }}</base-button>
      <base-button @click="validate">{{ $t('general.actions.save') }}</base-button>
    </template>
  </base-modal>

  <BaseConfirm
    ref="confirmDeleteEmployee"
    message="Deleting an employee cannot be undone."
    :choiceTrue="$t('general.actions.delete', {resource: 'employee'})"
  />

  <BaseConfirm
    ref="emailAlreadyExists"
    title="Email already in use"
    message="This email address is already associated with an employee."
    choiceTrue="Go back"
    no-false
  />

  <BaseConfirm
    ref="somethingWentWrong"
    title="Something went wrong"
    message="Something went wrong trying to create this employee."
    choiceTrue="Try again"
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
  computed: {
    roles() {
      return this.$store.getters['settings/roles'].map((role) => ({ id: role, display: role }));
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
};
</script>
