<template>
  <div class="actionbar">
    <div class="search">
      <input autocomplete="off" type="text" v-model.trim="searchInput" placeholder="Search Staff" ref="searchInput" />
      <span v-if="!searchInput" class="material-icons material-icons-round">search</span>
      <span v-else class="clear material-icons material-icons-round" @click="clearSearchInput">clear</span>
    </div>
    <div class="filter">
      {{ $t('general.actions.filter') }}:
      <base-badge
        @click="setFilter(status)"
        v-for="status in Object.keys(filters)"
        :key="status"
        :status="status"
        :class="{ inactive: !filters[status] }"
      ></base-badge>
      <span
        v-if="Object.values(filters).includes(true)"
        class="clear material-icons material-icons-round"
        @click="clearFilters"
        >clear</span
      >
    </div>
    <div class="actions">
      <base-button @click="addNewEmployee" icon="add">{{ $t('general.actions.add', { resource: 'Employee' }) }}</base-button>
    </div>
  </div>
  <main>
    <section id="employeelist">
      <div class="header">
        <div></div>
        <div>{{ $t('general.labels.name') }}</div>
        <div>{{ $t('general.labels.email') }}</div>
        <div>{{ $t('general.labels.phone') }}</div>
        <div>{{ $t('general.labels.role') }}</div>
        <div>{{ $t('general.labels.notes') }}</div>
      </div>

      <div class="row" v-for="employee in employees" :key="employee" @click="editEmployee(employee)">
        <div>
          <base-badge :status="employee.status" :label="false"></base-badge>
        </div>
        <div class="name">{{ getFullName(employee) }}</div>
        <div>{{ employee.email }}</div>
        <div>{{ employee.phone }}</div>
        <div>{{ employee.role }}</div>
        <div class="notes">{{ employee.notes }}</div>
      </div>
    </section>
  </main>
  <EditEmployee
    v-if="activeEmployee"
    :new="newEmployee"
    :employee="activeEmployee"
    @close-edit-employee="closeEditEmployee"
  />
</template>

<script>
import EditEmployee from '@/components/layout/EditEmployee.vue';

export default {
  components: {
    EditEmployee,
  },
  data() {
    return {
      newEmployee: false,
      activeEmployee: null,
      searchInput: '',
      filters: {},
    };
  },
  computed: {
    employees() {
      // Get all non-archived employees
      const employees = this.$store.getters['employees/employees'];

      // Apply filter & search
      return employees.filter((emp) => {
        if (Object.values(this.filters).includes(true)) {
          return (
            this.filters[emp.status] === true
            && this.getFullName(emp)
              .toLowerCase()
              .includes(this.searchInput.toLowerCase())
          );
        }
        return this.getFullName(emp)
          .toLowerCase()
          .includes(this.searchInput.toLowerCase());
      });
    },
  },
  methods: {
    editEmployee(employee) {
      this.activeEmployee = employee;
    },
    closeEditEmployee() {
      this.activeEmployee = null;
      this.newEmployee = false;
    },
    getFullName(employee) {
      return `${employee.firstName} ${employee.lastName}`;
    },
    setFilter(status) {
      this.filters[status] = !this.filters[status];
    },
    clearFilters() {
      Object.keys(this.filters).forEach((key) => {
        this.filters[key] = false;
      });
    },
    clearSearchInput() {
      this.searchInput = '';
      this.$refs.searchInput.focus();
    },
    addNewEmployee() {
      this.newEmployee = true;
      this.activeEmployee = true;
    },
  },
  mounted() {
    this.filters = this.$store.getters['settings/statuses'].reduce((acc, curr) => ({ ...acc, [curr.toLowerCase()]: false }), {});
  },
};
</script>
