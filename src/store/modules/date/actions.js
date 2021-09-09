export default {
  async setDates(context, weekId) {
    const dates = await context.dispatch("getDatesFromWeekId", weekId)

    let dateIds = []
    let datesShort = []
    let dayNames = []

    // Set dateIds and datesShort

    dates.forEach((date, index) => {
      // Set calendarPoint
      index === 3 ? context.commit("calendarPoint", date) : null

      // Get and format DateId
      dateIds.push(
        date.getFullYear() +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          date
            .getDate()
            .toString()
            .padStart(2, "0")
      )

      // Get and format dateShort
      let dateShort = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      datesShort.push(dateShort)

      // Get and format dayName
      let dayName = date.toLocaleDateString("en-US", { weekday: "long" })
      dayNames.push(dayName)
    })

    context.commit("weekId", weekId)
    context.commit("dateIds", dateIds)
    context.commit("datesShort", datesShort)
    context.commit("dayNames", dayNames)
    context.commit("dates", dates)
  },
  async getDatesFromWeekId(context, weekId) {
    const [year, week] = weekId.split("-")

    let dates = []

    // Find first day of week

    let monday = new Date(year, 0, 1 + (week - 1) * 7)

    if (monday.getDay() <= 4) {
      monday.setDate(monday.getDate() - monday.getDay() + 1)
    } else {
      monday.setDate(monday.getDate() + 8 - monday.getDay())
    }

    // Add function to iterate through days

    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf())
      date.setDate(date.getDate() + days)
      return date
    }

    // Fill date array

    for (let i = 0; i < 7; i++) {
      dates.push(monday.addDays(i))
    }

    return dates
  },
  async getWeekId(context, providedDate) {
    let date = providedDate || new Date()

    Date.prototype.getWeekNumber = function() {
      var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      var dayNum = d.getUTCDay() || 7
      d.setUTCDate(d.getUTCDate() + 4 - dayNum)
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
      return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
    }

    const weekId =
      date.getFullYear() +
      "-" +
      date
        .getWeekNumber()
        .toString()
        .padStart(2, "0")

    return weekId
  },
  async getWeekIdAndDay(context, providedDate) {
    const [date, month, year] = providedDate.split("-")

    const dateObject = new Date(year, month - 1, date)

    const weekId = await context.dispatch("getWeekId", dateObject)
    const day = dateObject.getUTCDay()

    return { weekId, day }
  },
}
