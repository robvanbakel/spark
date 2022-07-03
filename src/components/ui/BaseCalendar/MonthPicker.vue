<script setup>
import dayjs from '@/plugins/dayjs';

const props = defineProps({
  selectedMonth: {
    type: Number,
    required: true,
  },
  selectedYear: {
    type: Number,
    required: true,
  },
  active: {
    type: [Object, null],
    default: null,
  },
});

const emit = defineEmits(['choice']);

const pickMonth = (selectedMonth) => {
  emit('choice', selectedMonth);
};

const monthClasses = (num) => {
  const calendarFullDate = dayjs(new Date(props.selectedYear, num)).format('YYYYMM');
  const classes = [];

  if (calendarFullDate === dayjs().format('YYYYMM')) {
    classes.push('current');
  }

  if (calendarFullDate === dayjs(props.active).format('YYYYMM')) {
    classes.push('active');
  }

  return classes;
};

</script>

<template>
  <div id="months">
    <span
      v-for="(month, index) in 12"
      :key="month"
      :class="monthClasses(index)"
      @click="pickMonth(index)"
    >{{
      $dayjs().month(index).format('MMM')
    }}</span>
  </div>
</template>
