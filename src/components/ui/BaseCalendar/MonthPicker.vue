<script setup>
import dayjs from '@/plugins/dayjs';

const props = defineProps({
  date: {
    type: [Object, null],
    require: null,
  },
  currentView: {
    type: Object,
    require: true,
  },
});

const emit = defineEmits(['update:currentView', 'switchMode']);

const shiftYear = (val) => {
  emit('update:currentView', props.currentView.add(val, 'year'));
};

const pickMonth = (selectedMonth) => {
  emit('update:currentView', props.currentView.month(selectedMonth));
  emit('switchMode', 'DAY');
};

const monthClasses = (month) => {
  const calendarMonth = props.currentView.month(month);
  const classes = [];

  if (dayjs().isSame(calendarMonth, 'month')) {
    classes.push('current');
  }

  if (props.date?.isSame(calendarMonth, 'month')) {
    classes.push('active');
  }

  return classes;
};

</script>

<template>
  <div id="header">
    <span
      class="material-icons material-icons-round"
      @click="shiftYear(-1)"
    >chevron_left</span>
    <h2 @click="emit('switchMode', 'DAY')">
      {{ currentView.format('YYYY') }}
    </h2>
    <span
      class="material-icons material-icons-round"
      @click="shiftYear(1)"
    >chevron_right</span>
  </div>
  <div id="months">
    <span
      v-for="(month, index) in 12"
      :key="month"
      :class="monthClasses(index)"
      @click="pickMonth(index)"
    >{{
      dayjs.monthsShort()[index]
    }}</span>
  </div>
</template>
