import api from "@/utils/api";
import format from "@/utils/format";

export default {
  async getShifts() {
    const shifts = await api.get("db/shifts");
    this.shifts = format.shifts.res(shifts);
  },
  addNewShift(payload) {
    this.activeShiftId = "NEW";
    this.newShiftPrefillData = payload;
  },
  updateShiftLocally(payload) {
    if (payload.status === "NEW") {
      this.shifts.push({
        ...payload,
        status: "PROPOSED",
        statusUpdated: new Date().toISOString(),
      });

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
  saveEditShift(payload) {
    this.updateShiftLocally(payload);

    api[payload.status === "NEW" ? "post" : "patch"](
      `db/shifts/${payload.id}`,
      format.shifts.req(payload)
    );
  },
  deleteShiftLocally(shiftId = this.activeShiftId) {
    this.shifts = this.shifts.filter((shift) => shift.id !== shiftId);
  },
  async deleteShift(shiftId = this.activeShiftId) {
    this.deleteShiftLocally(shiftId);
    await api.destroy(`db/shifts/${shiftId}`);
  },
  acceptShifts(shiftIds) {
    shiftIds.forEach((shiftId) => {
      this.updateShiftLocally({ id: shiftId, status: "ACCEPTED" });
      api.patch(`accept/${shiftId}`);
    });
  },
};
