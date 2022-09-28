<script setup>
import { ref, computed } from "vue";

import EditEmployee from "@/components/layout/EditEmployee.vue";

import { useSettings, useEmployees } from "@/store";

import { useRouter } from "vue-router";

const settingsStore = useSettings();
const employeesStore = useEmployees();

const router = useRouter();

const searchInputField = ref();
const searchInput = ref("");
const filters = ref({});

const getFullName = (employee) => `${employee.firstName} ${employee.lastName}`;

const employees = computed(() => {
  // Get all non-archived employees
  const allEmployees = employeesStore.employees;

  // Apply filter & search
  return allEmployees.filter((emp) => {
    if (Object.values(filters.value).includes(true)) {
      return (
        filters.value[emp.status] === true &&
        getFullName(emp).toLowerCase().includes(searchInput.value.toLowerCase())
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
  searchInput.value = "";
  searchInputField.value.focus();
};

const toUserSettings = (employeeId) => {
  router.push({ name: "UserSettings", params: { id: employeeId } });
};

filters.value = settingsStore.statuses.reduce(
  (acc, i) => ({ ...acc, [i]: false }),
  {}
);
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
      />
      <span v-if="!searchInput" class="material-icons material-icons-round"
        >search</span
      >
      <span
        v-else
        class="clear material-icons material-icons-round"
        @click="clearSearchInput"
        >clear</span
      >
    </div>
    <div class="filter">
      {{ $t("general.actions.filter") }}:
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
        >clear</span
      >
    </div>
    <div class="actions">
      <base-button icon="add" @click="employeesStore.addNewUser()">
        {{ $t("general.actions.add", { resource: "Employee" }) }}
      </base-button>
    </div>
  </div>
  <main>
    <section id="employeelist">
      <table>
        <thead>
          <th class="badge" />
          <th class="name">
            {{ $t("general.labels.name") }}
          </th>
          <th>{{ $t("general.labels.email") }}</th>
          <th>{{ $t("general.labels.phone") }}</th>
          <th>{{ $t("general.labels.role") }}</th>
          <th>{{ $t("general.labels.notes") }}</th>
          <th class="settings" />
        </thead>
        <tbody>
          <tr
            v-for="employee in employees"
            :key="employee.id"
            class="row"
            @click="employeesStore.activeUserId = employee.id"
          >
            <td class="badge">
              <base-badge :status="employee.status" :label="false" />
            </td>
            <td class="name">
              {{ getFullName(employee) }}
            </td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.phone }}</td>
            <td>{{ employee.role }}</td>
            <td class="notes">
              {{ employee.notes }}
            </td>
            <td class="settings" @click.stop="toUserSettings(employee.id)">
              <span class="material-symbols-outlined">settings</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

  <EditEmployee v-if="employeesStore.activeUserId" />
</template>
