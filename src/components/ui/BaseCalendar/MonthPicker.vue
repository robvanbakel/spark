<template>
  <div id="months">
    <span v-for="(month, index) in 12" :key="month" @click="pickMonth(index)" :class="monthClasses(index)">{{
      $dayjs().month(index).format('MMM')
    }}</span>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  props: ['selectedMonth', 'selectedYear', 'active'],
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

<style></style>
