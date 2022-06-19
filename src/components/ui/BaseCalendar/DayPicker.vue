<template>
  <div id="days">
    <span v-for="day in $store.getters['date/dayNamesShort']" :key="day">{{ day }}</span>
  </div>
  <div class="dates">
    <p v-for="num in visibleInPrevMonth()" :key="num" class="prev-month" @click="$emit('prev')">
      {{ num }}
    </p>
    <p v-for="num in daysInMonth()" :key="num" :class="dateClasses(num)" @click="pickDate(num)">
      {{ num }}
    </p>
    <p v-for="num in visibleInNextMonth()" :key="num" class="next-month" @click="$emit('next')">
      {{ num }}
    </p>
  </div>
</template>

<script>
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
  emits: ['choice', 'prev', 'next'],
  methods: {
    daysInMonth() {
      return this.$dayjs()
        .year(this.selectedYear)
        .month(this.selectedMonth)
        .endOf('month')
        .date();
    },
    visibleInPrevMonth() {
      const amount = this.$dayjs()
        .year(this.selectedYear)
        .month(this.selectedMonth)
        .subtract(1, 'month')
        .endOf('month')
        .isoWeekday();

      const dates = [];

      for (let i = 1; i < amount + 1; i += 1) {
        dates.unshift(this.$dayjs()
          .year(this.selectedYear)
          .month(this.selectedMonth)
          .startOf('month')
          .subtract(i, 'day')
          .date());
      }

      return dates;
    },
    visibleInNextMonth() {
      const lastDayInMonth = this.$dayjs()
        .year(this.selectedYear)
        .month(this.selectedMonth)
        .endOf('month')
        .isoWeekday();

      return 7 - lastDayInMonth;
    },
    dateClasses(selectedDate) {
      const calendarFullDate = this.$dayjs().year(this.selectedYear).month(this.selectedMonth).date(selectedDate);
      const classes = [];

      if (calendarFullDate.isSame(this.$dayjs(), 'date')) {
        classes.push('current-date');
      }

      if (calendarFullDate.isSame(this.active, 'date')) {
        classes.push('active');
      }

      return classes;
    },
    pickDate(selectedDate) {
      const date = this.$dayjs().year(this.selectedYear).month(this.selectedMonth).date(selectedDate);
      this.$emit('choice', date);
    },
  },
};
</script>
