import dayjs from '@/plugins/dayjs';

export default {
  async setDates(context, weekId = dayjs().weekId()) {
    const [year, week] = weekId.split('-');

    const monday = dayjs().year(year).isoWeek(week).isoWeekday(1);
    const dates = Array.from({ length: 7 }, (element, index) => monday.add(index, 'day'));

    // Store in global state

    context.commit('weekId', weekId);
    context.commit('dates', dates);
  },
};
