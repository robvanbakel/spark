import dayjs from '@/plugins/dayjs';

export default {
  async setDates(weekId = dayjs().weekId()) {
    const [year, week] = weekId.split('-');

    const monday = dayjs().year(year).isoWeek(week).startOf('isoWeek');
    const dates = Array.from({ length: 7 }, (element, index) => monday.add(index, 'day'));

    this.dates = dates;
  },
};
