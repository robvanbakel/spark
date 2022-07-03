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

const emit = defineEmits(['choice', 'prev', 'next']);

const daysInMonth = () => dayjs()
  .year(props.selectedYear)
  .month(props.selectedMonth)
  .endOf('month')
  .date();

const visibleInPrevMonth = () => {
  const amount = dayjs()
    .year(props.selectedYear)
    .month(props.selectedMonth)
    .subtract(1, 'month')
    .endOf('month')
    .isoWeekday();

  const dates = [];

  for (let i = 1; i < amount + 1; i += 1) {
    dates.unshift(dayjs()
      .year(props.selectedYear)
      .month(props.selectedMonth)
      .startOf('month')
      .subtract(i, 'day')
      .date());
  }

  return dates;
};

const visibleInNextMonth = () => {
  const lastDayInMonth = dayjs()
    .year(props.selectedYear)
    .month(props.selectedMonth)
    .endOf('month')
    .isoWeekday();

  return 7 - lastDayInMonth;
};

const dateClasses = (selectedDate) => {
  const calendarFullDate = dayjs().year(props.selectedYear).month(props.selectedMonth).date(selectedDate);
  const classes = [];

  if (calendarFullDate.isSame(dayjs(), 'date')) {
    classes.push('current-date');
  }

  if (calendarFullDate.isSame(props.active, 'date')) {
    classes.push('active');
  }

  return classes;
};

const pickDate = (selectedDate) => {
  const date = dayjs().year(props.selectedYear).month(props.selectedMonth).date(selectedDate);
  emit('choice', date);
};
</script>

<template>
  <div id="days">
    <span
      v-for="day in $store.getters['date/dayNamesShort']"
      :key="day"
    >{{ day }}</span>
  </div>
  <div class="dates">
    <p
      v-for="num in visibleInPrevMonth()"
      :key="num"
      class="prev-month"
      @click="$emit('prev')"
    >
      {{ num }}
    </p>
    <p
      v-for="num in daysInMonth()"
      :key="num"
      :class="dateClasses(num)"
      @click="pickDate(num)"
    >
      {{ num }}
    </p>
    <p
      v-for="num in visibleInNextMonth()"
      :key="num"
      class="next-month"
      @click="$emit('next')"
    >
      {{ num }}
    </p>
  </div>
</template>
