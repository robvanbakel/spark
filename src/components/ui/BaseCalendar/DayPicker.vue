<template>
  <div id="days">
    <span v-for="day in $store.getters['date/dayNamesShort']" :key="day">{{ day }}</span>
  </div>
  <div class="dates">
    <p v-for="num in visibleInPrevMonth()" :key="num" class="prev-month" @click="prev()">
      {{ num }}
    </p>
    <p v-for="num in daysInMonth()" :key="num" :class="dateClasses(num)" @click="pickDate(num)">
      {{ num }}
    </p>
    <p v-for="num in visibleInNextMonth()" :key="num" class="next-month" @click="next()">
      {{ num }}
    </p>
  </div>
</template>

<script>
export default {
  props: ['selectedMonth', 'selectedYear', 'active'],
  emits: ['choice'],
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
    dateClasses(num) {
      const calendarFullDate = new Date(this.selectedYear, this.selectedMonth, num).toDateString()
      let classes = []

      if (calendarFullDate === new Date().toDateString()) {
        classes.push('current-date')
      }

      if (calendarFullDate === this.active?.toDateString()) {
        classes.push('active')
      }

      return classes
    },
    pickDate(selectedDay) {
      const date = new Date(this.selectedYear, this.selectedMonth, selectedDay)
      this.$emit('choice', date)
    },
  },
}
</script>

<style></style>
