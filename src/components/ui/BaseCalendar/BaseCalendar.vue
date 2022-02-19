<template>
  <div :class="['base-calendar', mode]">
    <div id="header">
      <span class="material-icons material-icons-round" @click="prev">chevron_left</span>
      <h2 @click="today">{{ selectedMonthName }} {{ selectedYear }}</h2>
      <span class="material-icons material-icons-round" @click="next">chevron_right</span>
    </div>
    <component
      :is="currentView"
      :selectedMonth="selectedMonth"
      :selectedYear="selectedYear"
      @choice="choice"
      :active="active"
    ></component>
  </div>
</template>

<script>
import DayPicker from '@/components/ui/BaseCalendar/DayPicker'

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
      this.$emit('choice',date)
    },
    next() {
      if (this.selectedMonth === 11) {
        this.selectedMonth = 0
        this.selectedYear++
      } else {
        this.selectedMonth++
      }
    },
    prev() {
      if (this.selectedMonth === 0) {
        this.selectedMonth = 11
        this.selectedYear--
      } else {
        this.selectedMonth--
      }
    },
    today() {
      this.selectedMonth = new Date().getMonth()
      this.selectedYear = new Date().getFullYear()
    },
  },
  computed: {
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
