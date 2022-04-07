export default {
  async setDates(context, weekId) {
    // If no weekId is specified, use current weekId
    weekId = weekId || (await context.dispatch('getWeekId'));

    // Find first day of week
    const [year, week] = weekId.split('-');

    const monday = new Date(year, 0, 1 + (week - 1) * 7);

    if (monday.getDay() <= 4) {
      monday.setDate(monday.getDate() - monday.getDay() + 1);
    } else {
      monday.setDate(monday.getDate() + 8 - monday.getDay());
    }

    // Create array of dates

    const dates = Array.from({ length: 7 }, (element, index) => {
      const date = new Date(monday);
      return new Date(date.setDate(date.getDate() + index));
    });

    // Store in global state

    context.commit('weekId', weekId);
    context.commit('dates', dates);
  },
  async getWeekId(context, providedDate = new Date()) {
    // Find fourth day of week (ISO-8601 definition)
    const date = new Date(Date.UTC(providedDate.getFullYear(), providedDate.getMonth(), providedDate.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));

    // Get year from date
    const year = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));

    // Calculate week number from date
    const week = Math.ceil(((date - year) / 86400000 + 1) / 7);

    // Construct weekId

    const weekId = `${year.getFullYear()}-${week.toString().padStart(2, '0')}`;

    return weekId;
  },
};
