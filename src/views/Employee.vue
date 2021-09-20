<template>
  <main v-if="$store.getters['auth/user'] && $store.getters['planner/schedules']">
    <section id="singleEmployeeCalendar">
      <div class="header">
        <h1>Hi {{ $store.getters["auth/user"].firstName }}</h1>
        <div class="actions">
          <base-button @click="openCalendar" icon="calendar_today">Add to Calendar</base-button>
          <base-button class="inverted icon-only" @click="generateQR">
            <span class="clear material-icons material-icons-round">qr_code_2</span>
          </base-button>
        </div>
      </div>
      <div class="calendar">
        <div class="colDays">
          <div class="row" v-for="(day, index) in 7" :key="index">
            <span class="dayName"> {{ days[index] }}</span>
            <span class="date">{{ $store.getters["date/datesShort"][index] }}</span>
          </div>
        </div>
        <div class="colCalendar" ref="calendar">
          <div class="row " v-for="(day, index) in schedule" :key="index">
            <!-- TODO Implement div.hours with :style="{ width: `${dayWidth}px`, left: `${startOffset}px` }" -->
            <div
              class="shift"
              v-if="day"
              :style="{ width: `${timeRangeToPercentage(day.start, day.end).percentage}%`, left: `${timeRangeToPercentage(day.start, day.end).startPoint}%` }"
            >
              <span class="place"> {{ day.place }}</span>
              <span class="time">{{ formatTime(day.start) }} - {{ formatTime(day.end) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    <the-sidebar>
      <section><PlannerCalendar /></section>
      <section v-if="showQR" style="height:264px; display:grid; place-items:center;">
        <img :src="qrCodeImg" alt="Link to calendar subscription" style="width: 220px" />
      </section>
    </the-sidebar>
  </main>
</template>

<script>
import QRCode from "qrcode"

import PlannerCalendar from "@/components/layout/PlannerCalendar"

export default {
  components: { PlannerCalendar },
  data() {
    return {
      qrCodeImg: null,
      calendarWidth: null,
      rows: [],
      showQR: false,
    }
  },
  computed: {
    webcalLink() {
      return `webcal://planner.robvanbakel.com/feed/${this.$store.getters["auth/user"].id}`
    },
    days() {
      return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    schedule() {
      const schedules = this.$store.getters["planner/schedules"]
      const weekId = this.$store.getters["date/weekId"]

      return schedules[weekId]
    },
    showRange() {
      const schedule = this.$store.getters["planner/schedules"][this.$store.getters["date/weekId"]]

      const startTimes = schedule.map((day) => day?.start).filter((item) => item)
      const showStart = Math.min(...startTimes)
        .toString()
        .padStart(4, "0")

      const endTmes = schedule.map((day) => day?.end).filter((item) => item)
      const showEnd = Math.max(...endTmes)
        .toString()
        .padStart(4, "0")

      return { showStart, showEnd }
    },
    dayWidth() {
      const { showStart, showEnd } = this.showRange

      // Destructure input
      const startHour = showStart.substring(0, 2)
      const startMin = showStart.substring(2, 4)
      const endHour = showEnd.substring(0, 2)
      const endMin = showEnd.substring(2, 4)

      // Calculate amount of hours and minutes
      const hours = endHour - startHour
      const mins = endMin - startMin

      const minFraction = mins / 60

      const range = hours + minFraction

      return this.calendarWidth / range
    },
    startOffset() {
      const { showStart } = this.showRange

      // Destructure input
      const startHour = showStart.substring(0, 2)
      const startMin = showStart.substring(2, 4)

      // Calculate starting point
      const startHourPercentage = parseInt(startHour)
      const startMinPercentage = startMin / 60
      const startPoint = startHourPercentage + startMinPercentage

      return -startPoint * this.dayWidth
    },
  },
  methods: {
    async generateQR() {
      this.qrCodeImg = await QRCode.toDataURL(this.webcalLink)
      this.showQR = true
    },
    openCalendar() {
      location.replace(this.webcalLink)
    },
    formatTime(time) {
      return time.substring(0, 2) + ":" + time.substring(2, 4)
    },
    checkCalendarWidth() {
      // this.calendarWidth = this.$refs.calendar?.clientWidth
    },
    timeRangeToPercentage(start, end) {
      // Destructure input
      const startHour = start.substring(0, 2)
      const startMin = start.substring(2, 4)
      const endHour = end.substring(0, 2)
      const endMin = end.substring(2, 4)

      // Calculate amount of hours and minutes
      const hours = endHour - startHour
      const mins = endMin - startMin

      // Calculate percentages
      const hoursPercentage = hours * 100
      const minsPercentage = (mins / 60) * 100

      const percentage = hoursPercentage + minsPercentage

      // Calculate starting point
      const startHourPercentage = startHour * 100
      const startMinPercentage = (startMin / 60) * 100
      const startPoint = startHourPercentage + startMinPercentage

      return { startPoint, percentage }
    },
  },
}
</script>
