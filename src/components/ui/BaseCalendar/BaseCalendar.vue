<script setup>
import { ref, computed } from 'vue';

import dayjs from '@/plugins/dayjs';

import DayPicker from '@/components/ui/BaseCalendar/DayPicker.vue';
import MonthPicker from '@/components/ui/BaseCalendar/MonthPicker.vue';

const props = defineProps({
  active: {
    type: Object,
    require: false,
  },
  mode: {
    type: String,
    require: true,
  },
});

const emit = defineEmits(['choice']);

const selectedMonth = ref(props.active?.month() || dayjs().month());
const selectedYear = ref(props.active?.year() || dayjs().year());
const currentView = ref('DayPicker');

const header = computed(() => {
  const date = dayjs().year(selectedYear.value).month(selectedMonth.value);

  if (currentView.value === 'MonthPicker') {
    return date.format('YYYY');
  }

  return date.format('MMMM YYYY');
});

const choice = (date) => {
  emit('choice', date);
};

const pickMonth = (month) => {
  selectedMonth.value = month;
  currentView.value = 'DayPicker';
};

const next = () => {
  if (currentView.value === 'DayPicker') {
    selectedMonth.value = (selectedMonth.value + 1) % 12;
    if (selectedMonth.value % 12 === 0) {
      selectedYear.value += 1;
    }
  } else {
    selectedYear.value += 1;
  }
};

const prev = () => {
  if (currentView.value === 'DayPicker') {
    selectedMonth.value = (selectedMonth.value + 11) % 12;
    if (selectedMonth.value % 12 === 11) {
      selectedYear.value -= 1;
    }
  } else {
    selectedYear.value -= 1;
  }
};

const changeView = () => {
  if (currentView.value === 'DayPicker') {
    currentView.value = 'MonthPicker';
  } else {
    currentView.value = 'DayPicker';
  }
};
</script>

<template>
  <div :class="['base-calendar', mode]">
    <div id="header">
      <span
        class="material-icons material-icons-round"
        @click="prev"
      >chevron_left</span>
      <h2 @click="changeView">
        {{ header }}
      </h2>
      <span
        class="material-icons material-icons-round"
        @click="next"
      >chevron_right</span>
    </div>
    <DayPicker
      v-if="currentView === 'DayPicker'"
      :selected-month="selectedMonth"
      :selected-year="selectedYear"
      :active="active"
      @prev="prev"
      @next="next"
      @choice="choice"
    />
    <MonthPicker
      v-if="currentView === 'MonthPicker'"
      :selected-month="selectedMonth"
      :selected-year="selectedYear"
      :active="active"
      @prev="prev"
      @next="next"
      @choice="pickMonth"
    />
  </div>
</template>
