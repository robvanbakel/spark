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
import DayPicker from '@/components/ui/BaseCalendar/DayPicker.vue';
import MonthPicker from '@/components/ui/BaseCalendar/MonthPicker.vue';

export default {
  props: {
    active: {
      type: Object,
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
      selectedMonth: this.active?.month() || this.$dayjs().month(),
      selectedYear: this.active?.year() || this.$dayjs().year(),
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
        if (this.selectedMonth % 12 === 0) {
          this.selectedYear += 1;
        }
      } else {
        this.selectedYear += 1;
      }
    },
    prev() {
      if (this.currentView === 'DayPicker') {
        this.selectedMonth = (this.selectedMonth + 11) % 12;
        if (this.selectedMonth % 12 === 11) {
          this.selectedYear -= 1;
        }
      } else {
        this.selectedYear -= 1;
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
      const date = this.$dayjs().year(this.selectedYear).month(this.selectedMonth);

      if (this.currentView === 'MonthPicker') {
        return date.format('YYYY');
      }

      return date.format('MMMM YYYY');
    },
  },
};
</script>

<style></style>
