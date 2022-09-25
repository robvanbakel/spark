import dayjs from "@/plugins/dayjs";

import { useDate, useEmployees } from "@/store";

export default {
  schedulesInView() {
    const dateStore = useDate();
    const schedulesInView = this.shifts.reduce((acc, shift) => {
      const index = dateStore.dates.findIndex((date) => date.isSame(shift.from, "day"));

      if (!acc[shift.employeeId]) {
        acc[shift.employeeId] = new Array(dateStore.dates.length);
      }

      if (index >= 0) {
        acc[shift.employeeId][index] = shift;
      }

      return acc;
    }, {});

    const totalHours = Object.entries(schedulesInView).reduce((acc, [employeeId, schedule]) => {
      acc[employeeId] = schedule.reduce((total, shift) => {
        if (!shift) return total;
        const shiftDuration = dayjs
          .duration(shift.to.diff(shift.from))
          .subtract(shift.break, "minutes");
        return total + shiftDuration.asHours();
      }, 0);

      return acc;
    }, {});

    const employeesStore = useEmployees();

    employeesStore.totalHours = totalHours;
    this.emptyWeek = !Object.values(schedulesInView).flat().length;

    return schedulesInView;
  },
};
