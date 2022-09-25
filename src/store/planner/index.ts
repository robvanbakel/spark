import { defineStore } from "pinia";
import dayjs from "@/plugins/dayjs";
import api from "@/utils/api";
import format from "@/utils/format";

import { useDate, useEmployees } from "@/store";

import { ShiftStatus, type Shift } from "@/types/planner";

interface State {
  shifts: Shift[];
  activeShiftId: string | null;
  newShiftPrefillData: Partial<Shift> | null;
  emptyWeek: boolean;
}

export default defineStore("planner", {
  state: (): State => ({
    shifts: [],
    activeShiftId: null,
    newShiftPrefillData: null,
    emptyWeek: true,
  }),
  actions: {
    async getShifts() {
      const shifts = await api.get("db/shifts");
      this.shifts = format.shifts.res(shifts);
    },
    addNewShift(payload: Partial<Shift>) {
      this.activeShiftId = "NEW";
      this.newShiftPrefillData = payload;
    },
    updateShiftLocally(payload: Partial<Shift>) {
      if (payload.status === ShiftStatus.NEW) {
        this.shifts.push({
          ...payload,
          status: ShiftStatus.PROPOSED,
          statusUpdated: new Date().toISOString(),
        } as Shift);
        return;
      }

      this.shifts = this.shifts.map((shift) => {
        if (shift.id !== payload.id) return shift;

        return {
          ...shift,
          ...payload,
        };
      });
    },
    saveEditShift(payload: Shift) {
      this.updateShiftLocally(payload);

      api[payload.status === ShiftStatus.NEW ? "post" : "patch"](
        `db/shifts/${payload.id}`,
        format.shifts.req(payload)
      );
    },
    deleteShiftLocally(shiftId?: string) {
      if (!shiftId) shiftId = this.activeShiftId as string;
      this.shifts = this.shifts.filter((shift) => shift.id !== shiftId);
    },
    async deleteShift(shiftId?: string) {
      if (!shiftId) shiftId = this.activeShiftId as string;
      this.deleteShiftLocally(shiftId);
      await api.destroy(`db/shifts/${shiftId}`);
    },
    acceptShifts(shiftIds: Shift["id"][]) {
      shiftIds.forEach((shiftId) => {
        this.updateShiftLocally({ id: shiftId, status: ShiftStatus.ACCEPTED });
        api.patch(`accept/${shiftId}`);
      });
    },
  },
  getters: {
    schedulesInView(): Record<Shift["id"], (Shift | undefined)[]> {
      const dateStore = useDate();
      const schedulesInView = this.shifts.reduce(
        (acc: Record<Shift["id"], (Shift | undefined)[]>, shift) => {
          const index = dateStore.dates.findIndex((date) =>
            date.isSame(shift.from, "day")
          );

          if (!acc[shift.employeeId]) {
            acc[shift.employeeId] = new Array(dateStore.dates.length);
          }

          if (index >= 0) {
            acc[shift.employeeId][index] = shift;
          }

          return acc;
        },
        {}
      );

      const totalHours = Object.entries(schedulesInView).reduce(
        (acc: Record<Shift["id"], number>, [employeeId, schedule]) => {
          acc[employeeId] = schedule.reduce((total, shift) => {
            if (!shift) return total;
            const shiftDuration = dayjs
              .duration(shift.to.diff(shift.from))
              .subtract(shift.break, "minutes");
            return total + shiftDuration.asHours();
          }, 0);

          return acc;
        },
        {}
      );

      const employeesStore = useEmployees();

      employeesStore.totalHours = totalHours;
      this.emptyWeek = !Object.values(schedulesInView).flat().length;

      return schedulesInView;
    },
  },
});
