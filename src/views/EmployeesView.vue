<script setup>
import { ref, computed } from 'vue';

import EditEmployee from '@/components/layout/EditEmployee.vue';

import { useSettings, useEmployees } from '@/store';

const settingsStore = useSettings();
const employeesStore = useEmployees();

const searchInputField = ref();
const searchInput = ref('');
const filters = ref({});

const getFullName = (employee) => `${employee.firstName} ${employee.lastName}`;

const employees = computed(() => {
  // Get all non-archived employees
  const allEmployees = employeesStore.employees;

  // Apply filter & search
  return allEmployees.filter((emp) => {
    if (Object.values(filters.value).includes(true)) {
      return (
        filters.value[emp.status] === true
            && getFullName(emp)
              .toLowerCase()
              .includes(searchInput.value.toLowerCase())
      );
    }
    return getFullName(emp)
      .toLowerCase()
      .includes(searchInput.value.toLowerCase());
  });
});

const setFilter = (status) => {
  filters.value[status] = !filters.value[status];
};

const clearFilters = () => {
  Object.keys(filters.value).forEach((key) => {
    filters.value[key] = false;
  });
};

const clearSearchInput = () => {
  searchInput.value = '';
  searchInputField.value.focus();
};

filters.value = settingsStore.statuses.reduce((acc, i) => ({ ...acc, [i]: false }), {});

</script>

<template>
  <div class="actionbar">
    <div class="search">
      <input
        ref="searchInputField"
        v-model.trim="searchInput"
        autocomplete="off"
        type="text"
        placeholder="Search Staff"
      >
      <span
        v-if="!searchInput"
        class="material-icons material-icons-round"
      >search</span>
      <span
        v-else
        class="clear material-icons material-icons-round"
        @click="clearSearchInput"
      >clear</span>
    </div>
    <div class="filter">
      {{ $t('general.actions.filter') }}:
      <base-badge
        v-for="status in Object.keys(filters)"
        :key="status"
        :status="status"
        :class="{ inactive: !filters[status] }"
        @click="setFilter(status)"
      />
      <span
        v-if="Object.values(filters).includes(true)"
        class="clear material-icons material-icons-round"
        @click="clearFilters"
      >clear</span>
    </div>
    <div class="actions">
      <base-button
        icon="add"
        @click="employeesStore.addNewUser()"
      >
        {{ $t('general.actions.add', { resource: 'Employee' }) }}
      </base-button>
    </div>
  </div>
  <main>
    <section id="employeelist">
      <div class="header">
        <div />
        <div>{{ $t('general.labels.name') }}</div>
        <div>{{ $t('general.labels.email') }}</div>
        <div>{{ $t('general.labels.phone') }}</div>
        <div>{{ $t('general.labels.role') }}</div>
        <div>{{ $t('general.labels.notes') }}</div>
      </div>

      <div
        v-for="employee in employees"
        :key="employee.id"
        class="row"
        @click="employeesStore.activeUserId = employee.id"
      >
        <div>
          <base-badge
            :status="employee.status"
            :label="false"
          />
        </div>
        <div class="name">
          {{ getFullName(employee) }}
        </div>
        <div>{{ employee.email }}</div>
        <div>{{ employee.phone }}</div>
        <div>{{ employee.role }}</div>
        <div class="notes">
          {{ employee.notes }}
        </div>
      </div>
    </section>
  </main>

  <EditEmployee v-if="employeesStore.activeUserId" />
</template>
