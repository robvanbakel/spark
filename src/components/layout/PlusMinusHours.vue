<script setup>
import { ref } from 'vue';

import { useStore } from 'vuex';

const store = useStore();

defineProps({
  roles: {
    type: Array,
    required: true,
  },
  search: {
    type: String,
    default: '',
  },
});

const showAll = ref(true);

const calculatePlusMinusHours = (employeeId) => {
  const contractHours = store.getters['employees/employees'].find((employee) => employee.id === employeeId).contract;
  const calculatedHours = store.getters['employees/totalHours'][employeeId];

  const plusMinusHours = calculatedHours - contractHours;

  return plusMinusHours;
};

const employeeFullName = (employee) => `${employee.firstName} ${employee.lastName}`;

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const computedShowAll = (employeeId) => {
  if (showAll.value || store.getters['employees/totalHours'][employeeId] > 0) {
    return true;
  }
  return false;
};
</script>

<template>
  <div class="plus-minus-hours-wrapper">
    <div
      v-for="role in roles"
      :key="role"
      class="plus-minus-hours-role-wrapper"
    >
      <div
        v-for="employee in store.getters['employees/employees']"
        :key="employee.id"
      >
        <div
          v-if="
            employee.role.toLowerCase() === role &&
              calculatePlusMinusHours(employee.id) &&
              computedShowAll(employee.id) &&
              employeeFullName(employee)
                .toLowerCase()
                .includes(search.toLowerCase())
          "
          class="entry"
        >
          <div class="hours">
            <span :class="calculatePlusMinusHours(employee.id) < 0 ? 'minus' : 'plus'">
              {{ ((calculatePlusMinusHours(employee.id) > 0) ? '+' : '') + calculatePlusMinusHours(employee.id).toFixed(2) }}
            </span>
          </div>
          <div class="employee-info">
            <span class="name">{{ employee.firstName }} {{ employee.lastName }}</span>
            <span class="role">{{ employee.role }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="show-all"
      @click="toggleShowAll"
    >
      <div v-if="showAll">
        Show scheduled employees
        <span class="material-icons material-icons-round">expand_less</span>
      </div>
      <div v-else>
        Show all employees
        <span class="material-icons material-icons-round">expand_more</span>
      </div>
    </div>
  </div>
</template>
