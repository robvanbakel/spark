<script setup>
import { ref, computed, watch } from 'vue';

import dayjs from '@/plugins/dayjs';

import { useRouter } from 'vue-router';

import { useDate } from '@/pinia';

const dateStore = useDate();

const router = useRouter();

const selectedMonth = ref(new Date().getMonth());
const selectedYear = ref(new Date().getFullYear());

const calendarHeader = computed(() => dayjs()
  .year(selectedYear.value)
  .month(selectedMonth.value)
  .format('MMMM YYYY'));

const calendarPoint = computed(() => dateStore.dates[3]);

watch(calendarPoint, () => {
  const currentWeekId = dayjs().weekId();

  if (dateStore.weekId === currentWeekId) {
    selectedMonth.value = new Date().getMonth();
    selectedYear.value = new Date().getFullYear();
  } else {
    selectedMonth.value = dateStore.dates[3].toDate().getMonth();
    selectedYear.value = dateStore.dates[3].toDate().getFullYear();
  }
});

const daysInMonth = () => new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate();

const visibleInPrevMonth = () => {
  const amount = new Date(selectedYear.value, selectedMonth.value, 0).getDay();

  const dates = [];

  for (let i = 0; i < amount; i += 1) {
    dates.unshift(new Date(selectedYear.value, selectedMonth.value, -i).getDate());
  }

  return dates;
};

const visibleInNextMonth = () => {
  const lastDayInMonth = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDay();

  if (lastDayInMonth === 0) return null;

  return 7 - lastDayInMonth;
};

const next = () => {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0;
    selectedYear.value += 1;
  } else {
    selectedMonth.value += 1;
  }
};

const prev = () => {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11;
    selectedYear.value -= 1;
  } else {
    selectedMonth.value -= 1;
  }
};

const calendarPointClass = (num) => {
  const calendarFullDate = new Date(selectedYear.value, selectedMonth.value, num).toDateString();

  let dateClass = '';

  dateStore.dates.forEach((date) => {
    if (calendarFullDate === date.toDate().toDateString()) {
      dateClass = 'selected';
    }
  });

  return dateClass;
};

const currentDateClass = (num) => {
  const calendarFullDate = new Date(selectedYear.value, selectedMonth.value, num).toDateString();
  const currentFullDate = new Date().toDateString();

  return calendarFullDate === currentFullDate ? 'current-date' : '';
};

const today = () => {
  selectedMonth.value = new Date().getMonth();
  selectedYear.value = new Date().getFullYear();
};

const setWeek = async (selectedDay) => {
  const date = new Date(selectedYear.value, selectedMonth.value, selectedDay);
  const selectedWeekId = dayjs(date).weekId();
  router.push({ params: { weekId: selectedWeekId } });
};
</script>

<template>
  <div class="plannerCalendar">
    <div id="header">
      <span
        class="material-icons material-icons-round"
        @click="prev"
      >chevron_left</span>
      <h2 @click="today">
        {{ calendarHeader }}
      </h2>
      <span
        class="material-icons material-icons-round"
        @click="next"
      >chevron_right</span>
    </div>
    <div id="days">
      <span
        v-for="day in 7"
        :key="day"
      >{{ dayjs.weekdaysShort()[day % 7 ] }}</span>
    </div>
    <div class="dates">
      <p
        v-for="num in visibleInPrevMonth()"
        :key="num"
        class="prev-month"
        @click="prev()"
      >
        {{ num }}
      </p>
      <p
        v-for="num in daysInMonth()"
        :key="num"
        :class="[currentDateClass(num), calendarPointClass(num)]"
        @click="setWeek(num)"
      >
        {{ num }}
      </p>
      <p
        v-for="num in visibleInNextMonth()"
        :key="num"
        class="next-month"
        @click="next()"
      >
        {{ num }}
      </p>
    </div>
  </div>
</template>
