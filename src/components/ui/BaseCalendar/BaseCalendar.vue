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
import DayPicker from '@/components/ui/BaseCalendar/DayPicker'
import MonthPicker from '@/components/ui/BaseCalendar/MonthPicker'

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
    }
  },
  methods: {
    choice(date) {
      this.$emit('choice', date)
    },
    pickMonth(month) {
      this.selectedMonth = month
      this.currentView = 'DayPicker'
    },
    next() {
      if (this.currentView === 'DayPicker') {
        if (this.selectedMonth === 11) {
          this.selectedMonth = 0
          this.selectedYear++
        } else {
          this.selectedMonth++
        }
      } else {
        this.selectedYear++
      }
    },
    prev() {
      if (this.currentView === 'DayPicker') {
        if (this.selectedMonth === 0) {
          this.selectedMonth = 11
          this.selectedYear--
        } else {
          this.selectedMonth--
        }
      } else {
        this.selectedYear--
      }
    },
    changeView() {
      if (this.currentView === 'DayPicker') {
        this.currentView = 'MonthPicker'
      } else {
        this.currentView = 'DayPicker'
      }
    },
    today() {
      this.selectedMonth = new Date().getMonth()
      this.selectedYear = new Date().getFullYear()
    },
  },
  computed: {
    header() {
      if (this.currentView === 'MonthPicker') {
        return `${this.selectedYear}`
      }
      return `${this.selectedMonthName} ${this.selectedYear}`
    },
    selectedMonthName() {
      return new Date(this.selectedYear, this.selectedMonth).toLocaleString(
        this.$store.getters['settings/dateLocale'],
        { month: 'long' }
      )
    },
  },
}
</script>

<style></style>
