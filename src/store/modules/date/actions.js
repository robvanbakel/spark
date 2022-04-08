import dayjs from '@/plugins/dayjs';

export default {
  async setDates(context, weekId = dayjs().weekId()) {
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
};
