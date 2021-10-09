<template>
  <div :class="['base-calendar', mode]">
    <div id="header">
      <span class="material-icons material-icons-round" @click="prev">chevron_left</span>
      <h2 @click="today">{{ selectedMonthName }} {{ selectedYear }}</h2>
      <span class="material-icons material-icons-round" @click="next">chevron_right</span>
    </div>
    <div id="days">
      <span v-for="day in shortDays" :key="day">{{ day }}</span>
    </div>
    <div class="dates">
      <p v-for="num in visibleInPrevMonth()" :key="num" class="prev-month" @click="prev()">
        {{ num }}
      </p>
      <p v-for="num in daysInMonth()" :key="num" :class="[currentDateClass(num)]" @click="pickDate(num)">
        {{ num }}
      </p>
      <p v-for="num in visibleInNextMonth()" :key="num" class="next-month" @click="next()">
        {{ num }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      selectedMonth: new Date().getMonth(),
      selectedYear: new Date().getFullYear(),
    }
  },
  methods: {
    daysInMonth() {
      return new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate()
    },
    visibleInPrevMonth() {
      const amount = new Date(this.selectedYear, this.selectedMonth, 0).getDay()

      let dates = []

      for (let i = 0; i < amount; i++) {
        dates.unshift(new Date(this.selectedYear, this.selectedMonth, -i).getDate())
      }

      return dates
    },
    visibleInNextMonth() {
      const lastDayInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDay()

      if (lastDayInMonth != 0) {
        return 7 - lastDayInMonth
      }
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
    currentDateClass(num) {
      const calendarFullDate = new Date(this.selectedYear, this.selectedMonth, num).toDateString()
      const currentFullDate = new Date().toDateString()

      return calendarFullDate === currentFullDate ? "current-date" : ""
    },
    today() {
      this.selectedMonth = new Date().getMonth()
      this.selectedYear = new Date().getFullYear()
    },
    pickDate(selectedDay) {
      const date = new Date(this.selectedYear, this.selectedMonth, selectedDay)
      this.$emit('choice', date)
    },
  },
  computed: {
    selectedMonthName() {
      return new Date(this.selectedYear, this.selectedMonth).toLocaleString(this.$store.getters['settings/dateLocale'], { month: "long" })
    },
    shortDays() {
      return this.$store.getters['date/dates'].map(date => date.toLocaleDateString(this.$store.getters['settings/dateLocale'], { weekday: "short" }))
    },
    calendarPoint() {
      return this.$store.getters["date/dates"][3]
    },
  },
  watch: {
    async calendarPoint() {
      const currentWeekId = await this.$store.dispatch("date/getWeekId")

      if (this.$store.getters["date/weekId"] === currentWeekId) {
        this.selectedMonth = new Date().getMonth()
        this.selectedYear = new Date().getFullYear()
      } else {
        this.selectedMonth = this.$store.getters["date/dates"][3].getMonth()
        this.selectedYear = this.$store.getters["date/dates"][3].getFullYear()
      }
    },
  },
}
</script>

<style></style>
