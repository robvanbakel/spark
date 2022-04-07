<template>
  <div :class="['base-calendar', mode]">
    <div id="header">
      <span class="material-icons material-icons-round" @click="prev">chevron_left</span>
      <h2 @click="changeView">{{ header }}</h2>
      <span class="material-icons material-icons-round" @click="next">chevron_right</span>
    </div>
    <DayPicker
      v-if="currentView === 'DayPicker'"
      :selectedMonth="selectedMonth"
      :selectedYear="selectedYear"
      :active="active"
      @prev="prev"
      @next="next"
      @choice="choice"
    />
    <MonthPicker
      v-if="currentView === 'MonthPicker'"
      :selectedMonth="selectedMonth"
      :selectedYear="selectedYear"
      :active="active"
      @prev="prev"
      @next="next"
      @choice="pickMonth"
    />
  </div>
</template>

<script>
import DayPicker from '@/components/ui/BaseCalendar/DayPicker';
import MonthPicker from '@/components/ui/BaseCalendar/MonthPicker';

export default {
  props: {
    active: {
      type: Date,
      require: false,
    },
    mode: {
      type: String,
      require: true,
    },
  },
  emits: ['choice'],
  components: {
    DayPicker,
    MonthPicker,
  },
  data() {
    return {
      selectedMonth: this.active?.getMonth() || new Date().getMonth(),
      selectedYear: this.active?.getFullYear() || new Date().getFullYear(),
      currentView: 'DayPicker',
    };
  },
  methods: {
    choice(date) {
      this.$emit('choice', date);
    },
    pickMonth(month) {
      this.selectedMonth = month;
      this.currentView = 'DayPicker';
    },
    next() {
      if (this.currentView === 'DayPicker') {
        this.selectedMonth = (this.selectedMonth + 1) % 12;
        this.selectedMonth % 12 === 0 && this.selectedYear++;
      } else {
        this.selectedYear++;
      }
    },
    prev() {
      if (this.currentView === 'DayPicker') {
        this.selectedMonth = (this.selectedMonth + 11) % 12;
        this.selectedMonth % 12 === 11 && this.selectedYear--;
      } else {
        this.selectedYear--;
      }
    },
    changeView() {
      if (this.currentView === 'DayPicker') {
        this.currentView = 'MonthPicker';
      } else {
        this.currentView = 'DayPicker';
      }
    },
    today() {
      this.selectedMonth = new Date().getMonth();
      this.selectedYear = new Date().getFullYear();
    },
  },
  computed: {
    header() {
      const date = this.$dayjs()
        .year(this.selectedYear)
        .month(this.selectedMonth);

      if (this.currentView === 'MonthPicker') {
        return date.format('YYYY');
      }

      return date.format('MMMM YYYY');
    },
  },
};
</script>

<style></style>
