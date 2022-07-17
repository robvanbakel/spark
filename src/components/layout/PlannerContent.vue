<script setup>
import { computed } from 'vue';

import PlannerRow from '@/components/layout/PlannerRow.vue';

import { useEmployees } from '@/pinia';

const employeesStore = useEmployees();

const props = defineProps({
  schedules: {
    type: Object,
    required: true,
  },
  roles: {
    type: Array,
    required: true,
  },
  search: {
    type: String,
    default: '',
  },
});

const employees = computed(() => {
  const output = [];

  props.roles.forEach((role) => {
    employeesStore.users.forEach((user) => {
      if (role === user.role?.toLowerCase() && `${user.firstName} ${user.lastName}`.toLowerCase().includes(props.search.toLowerCase())) {
        output.push(user);
      }
    });
  });

  return output;
});
</script>

<template>
  <PlannerRow
    v-for="employee in employees"
    :key="employee.id"
    :employee="employee"
    :schedule="schedules[employee.id]"
    :search="search"
  />
  <PlannerRow />
</template>
