<script setup>
import { computed } from 'vue';

import ShiftBlock from '@/components/layout/ShiftBlock.vue';

import { useStore } from 'vuex';

import { useDate } from '@/pinia';

const dateStore = useDate();

const store = useStore();

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
    store.dispatch('planner/setActiveShiftId', props.schedule[index].id);
  } else {
    store.dispatch('planner/addNewShift', {
      employeeId: props.employee?.id,
      from: dateStore.dates[index],
      to: dateStore.dates[index],
    });
  }
};
</script>

<template>
  <div v-if="employee">
    <div
      v-if="hasSchedulesInView"
      class="row"
      :class="employee.role?.toLowerCase()"
    >
      <div class="employee">
        <span class="name">{{ employee.firstName }} {{ employee.lastName }}</span>
        <span class="hours">
          <span class="calculated">
            {{ store.getters['employees/totalHours'][employee.id]?.toFixed(2) }}</span> /
          {{ employee.contract }} hours
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
