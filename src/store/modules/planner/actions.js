import firebase from "firebase/app"
import { db } from "@/firebase"

export default {
  setActiveShiftId(context, payload) {
    context.commit("activeShiftId", payload)
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

    // If shiftId changed, check if documents exist
    if (context.getters["activeShiftId"] !== "new" && shiftIdChanged(context.getters["activeShiftId"], payload.shiftId)) {
      // Delete old shift locally
      context.commit("updateShiftLocally", {
        shiftId: context.getters["activeShiftId"],
        shiftInfo: null,
      })

      // Prepare object to update DB
      const { weekId, employeeId, day } = context.getters["activeShiftId"]
      const schedule = context.getters["schedules"][weekId][employeeId]
      schedule[day] = null

      // Pass updated schdule to DB; delete schedule if schedule is empty
      if (schedule.filter((i) => i !== null).length) {
        db.collection("schedules")
          .doc(weekId)
          .set({ [employeeId]: [...schedule] }, { merge: true })
      } else {
        db.collection("schedules")
          .doc(weekId)
          .update({ [employeeId]: firebase.firestore.FieldValue.delete() })
      }
    }

    // If not present, instantiate empty schedule
    context.commit("createEmptySchedule", payload.shiftId)

    // Update locally
    context.commit("updateShiftLocally", payload)

    // Update DB
    const { weekId, employeeId, day } = payload.shiftId
    const schedule = context.getters["schedules"][weekId][employeeId]
    schedule[day] = payload.shiftInfo

    db.collection("schedules")
      .doc(weekId)
      .set({ [employeeId]: [...schedule] }, { merge: true })
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
