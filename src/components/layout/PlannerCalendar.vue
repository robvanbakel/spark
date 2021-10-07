<template>
  <div class="plannerCalendar">
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
      <p v-for="num in daysInMonth()" :key="num" :class="[currentDateClass(num), calendarPointClass(num)]" @click="setWeek(num)">
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
    calendarPointClass(num) {
      const calendarFullDate = new Date(this.selectedYear, this.selectedMonth, num).toDateString()

      let dateClass = ""

      this.$store.getters["date/dates"].forEach((date) => {
        calendarFullDate === date.toDateString() ? (dateClass = "selected") : ""
      })

      return dateClass
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
    async setWeek(selectedDay) {
      const date = new Date(this.selectedYear, this.selectedMonth, selectedDay)
      const selectedWeekId = await this.$store.dispatch("date/getWeekId", date)

      this.$router.push({ params: { weekId: selectedWeekId } })
    },
  },
  computed: {
    selectedMonthName() {
      return new Date(this.selectedYear, this.selectedMonth).toLocaleString("en-US", { month: "long" })
    },
    shortDays() {
      return ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
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
