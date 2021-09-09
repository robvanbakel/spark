import { db } from "@/firebase"

export default {
  setActiveShiftId(context, payload) {
    if (payload) {
      context.commit("activeShiftId", payload)
    } else {
      context.commit("activeShiftId", null)
    }
  },
  async addNewShift(context, payload) {
    // Update DB
    const res = await db.collection("schedules").add(payload)

    // Update locally
    context.commit("updateShiftLocally", {
      newShiftId: res.id,
      shift: payload,
    })
  },
  async saveEditShift(context, payload) {
    // Helper function to check if two ojbects have equal values
    const shiftIdChanged = (obj1, obj2) => {
      for (const key in obj1) {
        if (obj1[key] !== obj2[key]) {
          return true
        }
      }
      return false
    }

    // Check if shiftId changed and update shiftInfo
    if (!shiftIdChanged(context.getters["activeShiftId"], payload.shiftId)) {
      // Update locally
      context.commit("updateShiftLocally", payload)

      // Update DB

      const { weekId, employeeId, day } = payload.shiftId

      const schedule = context.getters["schedules"][weekId][employeeId]

      schedule[day] = payload.shiftInfo

      await db
        .collection("schedules")
        .doc(weekId)
        .set({ [employeeId]: [...schedule] }, { merge: true })

    } 
  },
  deleteShift(context) {
    // Update DB
    db.collection("schedules")
      .doc(context.getters.activeShiftId)
      .delete()

    // Update locally
    context.commit("removeShiftLocally", context.getters.activeShiftId)
  },
  async getSchedules(context) {
    let schedules = {}

    const snapshot = await db.collection("schedules").get()
    snapshot.forEach((doc) => {
      schedules[doc.id] = doc.data()
    })

    context.commit("schedules", schedules)
  },
}
