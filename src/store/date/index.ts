import dayjs from "@/plugins/dayjs";
import type { Dayjs } from "dayjs";

import { defineStore } from "pinia";

interface State {
  dates: Dayjs[];
}

export default defineStore("date", {
  state: (): State => ({
    dates: [],
  }),
  actions: {
    async setDates(weekId = dayjs().weekId()) {
      const [year, week] = weekId.split("-");

      const monday = dayjs()
        .year(Number(year))
        .isoWeek(Number(week))
        .startOf("isoWeek");

      const dates = Array.from({ length: 7 }, (element, index) =>
        monday.add(index, "day")
      );

      this.dates = dates;
    },
  },
  getters: {
    weekId(): string {
      return this.dates[0].weekId();
    },
    weekNumber(): number {
      return Number(this.weekId.split("-")[1]);
    },
  },
});
