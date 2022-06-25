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

<script>
import dayjs from 'dayjs';

export default {
  props: {
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
  },
  emits: ['choice'],
  methods: {
    pickMonth(selectedMonth) {
      this.$emit('choice', selectedMonth);
    },
    monthClasses(num) {
      const calendarFullDate = dayjs(new Date(this.selectedYear, num)).format('YYYYMM');
      const classes = [];

      if (calendarFullDate === dayjs().format('YYYYMM')) {
        classes.push('current');
      }

      if (calendarFullDate === dayjs(this.active).format('YYYYMM')) {
        classes.push('active');
      }

      return classes;
    },
  },
};
</script>
