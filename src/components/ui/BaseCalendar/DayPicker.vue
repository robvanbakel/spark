<script setup>
import dayjs from "@/plugins/dayjs";

const props = defineProps({
  currentView: {
    type: Object,
    require: true,
  },
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "update:currentView", "switchMode"]);

const shiftMonth = (val) => {
  emit("update:currentView", props.currentView.add(val, "month"));
};

const visibleInPrevMonth = () => {
  const amount = props.currentView.subtract(1, "month").endOf("month").isoWeekday();

  if (amount === 7) return [];

  const dates = [];

  for (let i = 0; i < amount; i += 1) {
    dates.unshift(props.currentView.subtract(i + 1, "day").date());
  }

  return dates;
};

const visibleInNextMonth = () => 7 - props.currentView.endOf("month").isoWeekday();

const dateClasses = (selectedDate) => {
  const calendarFullDate = props.currentView.date(selectedDate);
  const classes = [];

  if (calendarFullDate.isSame(dayjs(), "date")) {
    classes.push("current-date");
  }

  if (calendarFullDate.isSame(props.modelValue, "date")) {
    classes.push("active");
  }

  return classes;
};

const pickDate = (date) => {
  emit(
    "update:modelValue",
    props.currentView
      .date(date)
      .hour(props.modelValue?.hour() || 0)
      .minute(props.modelValue?.minute() || 0)
  );
};
</script>

<template>
  <div id="header">
    <span class="material-icons material-icons-round" @click="shiftMonth(-1)">chevron_left</span>
    <h2 @click="emit('switchMode', 'MONTH')">
      {{ currentView.format("MMMM YYYY") }}
    </h2>
    <span class="material-icons material-icons-round" @click="shiftMonth(1)">chevron_right</span>
  </div>
  <div id="days">
    <span v-for="day in 7" :key="day">{{ dayjs.weekdaysShort()[day % 7] }}</span>
  </div>
  <div class="dates">
    <p v-for="num in visibleInPrevMonth()" :key="num" class="out-of-view" @click="shiftMonth(-1)">
      {{ num }}
    </p>
    <p
      v-for="num in currentView.daysInMonth()"
      :key="num"
      :class="dateClasses(num)"
      @click="pickDate(num)"
    >
      {{ num }}
    </p>
    <p v-for="num in visibleInNextMonth()" :key="num" class="out-of-view" @click="shiftMonth(1)">
      {{ num }}
    </p>
  </div>
</template>
