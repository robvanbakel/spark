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
      selectedDate: this.$store.getters["date/calendarPoint"].getDate(),
      selectedMonth: this.$store.getters["date/calendarPoint"].getMonth(),
      selectedYear: this.$store.getters["date/calendarPoint"].getFullYear(),
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

      this.$store.getters["date/dateIds"].forEach((dateId) => {
        const selectedYear = dateId.slice(0, 4)
        const selectedMonth = parseInt(dateId.slice(4, 6) - 1)
        const selectedDate = dateId.slice(6, 8)

        const selectedFullDate = new Date(selectedYear, selectedMonth, selectedDate).toDateString()

        calendarFullDate === selectedFullDate ? (dateClass = "selected") : ""
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
      return this.$store.getters["date/calendarPoint"]
    },
  },
  watch: {
    calendarPoint() {
      this.selectedDate = this.$store.getters["date/calendarPoint"].getDate()
      this.selectedMonth = this.$store.getters["date/calendarPoint"].getMonth()
      this.selectedYear = this.$store.getters["date/calendarPoint"].getFullYear()
    },
  },
}
</script>
<style scoped>
section {
  width: 320px;
}
section#title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

section#title button {
  padding: 0.2em 0.4em;
}

section#title h2 {
  text-align: center;
  font-size: 1.1rem;
  cursor: pointer;
}

section#header {
  background: #e63946;
  font-weight: 700;
  color: #fff;
  padding: 0.5em 0;
  margin-bottom: 0.25em;
}

section#dates p {
  padding: 0.7em 0;
  border-radius: 4px;
  cursor: pointer;
}

section#dates p.prev-month,
section#dates p.next-month {
  opacity: 0.15;
}
section#dates p:hover {
  background: #eee;
}

section#dates p.current-date {
  font-weight: 600;
  color: #e63946;
}

section {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}
</style>
