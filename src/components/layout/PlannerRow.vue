<script setup lang="ts">
import { computed } from "vue";

import ShiftBlock from "@/components/layout/ShiftBlock.vue";

import { useDate, useEmployees, usePlanner } from "@/store";

const dateStore = useDate();
const employeesStore = useEmployees();
const plannerStore = usePlanner();

const props = defineProps({
  employee: {
    type: [Object, null],
    default: null,
  },
  schedule: {
    type: [Array, null],
    default: null,
  },
});

const hasSchedulesInView = computed(() => props.schedule && !props.schedule?.every((v) => !v));

const handleClick = (index) => {
  if (props.schedule && props.schedule[index]) {
    plannerStore.activeShiftId = props.schedule[index].id;
  } else {
    plannerStore.addNewShift({
      employeeId: props.employee?.id,
      from: dateStore.dates[index],
      to: dateStore.dates[index],
    });
  }
};
</script>

<template>
  <div v-if="employee">
    <div v-if="hasSchedulesInView" class="row" :class="employee.role?.toLowerCase()">
      <div class="employee">
        <span class="name">{{ employee.firstName }} {{ employee.lastName }}</span>
        <span class="hours">
          <span class="calculated"> {{ employeesStore.totalHours[employee.id]?.toFixed(2) }}</span>
          / {{ employee.contract }} hours
        </span>
      </div>
      <ShiftBlock
        v-for="(shift, index) in schedule"
        :key="index"
        :shift="shift"
        @click="handleClick(index)"
      />
    </div>
  </div>
  <div v-else>
    <div>
      <div class="row">
        <div class="employee" />
        <ShiftBlock
          v-for="(date, index) in dateStore.dates"
          :key="date"
          @click="handleClick(index)"
        />
      </div>
    </div>
  </div>
</template>
