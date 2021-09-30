import firebase from "firebase/app"
import { db } from "@/firebase"

export default {
  async getSchedules(context) {

    let schedules = {}

    if (context.rootGetters["auth/admin"]) {

      // If user is admin, get all schedules from DB
      const snapshot = await db.collection("schedules").get()
      snapshot.forEach((doc) => {
        schedules[doc.id] = doc.data()
      })
    } else {

      // If user is not admin, get schedules associated with current user 
      const res = await fetch(`${process.env.VUE_APP_ADMIN_HOST || ""}/getSchedules/${context.rootGetters['auth/user'].id}`)
      schedules = await res.json()

    }

    context.commit("schedules", schedules)
  },
  setActiveShiftId(context, payload) {
    context.commit("activeShiftId", payload)
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

    // If shiftId changed, remove shift with old shiftId
    if (context.getters["activeShiftId"] !== "new" && shiftIdChanged(context.getters["activeShiftId"], payload.shiftId)) {
      context.dispatch("deleteShift")
    }

    // If new shiftId not present, instantiate empty schedule
    context.commit("createEmptySchedule", payload.shiftId)

    // Update locally
    context.commit("updateShiftLocally", payload)

    // Prepare object to update DB
    const { weekId, employeeId, day } = payload.shiftId
    const schedule = context.getters["schedules"][weekId][employeeId]
    schedule[day] = payload.shiftInfo
    
    // Update DB
    db.collection("schedules")
      .doc(weekId)
      .set({ [employeeId]: [...schedule] }, { merge: true })
  },
  deleteShift(context) {
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
      context.commit("deleteScheduleLocally", context.getters["activeShiftId"])

      db.collection("schedules")
        .doc(weekId)
        .update({ [employeeId]: firebase.firestore.FieldValue.delete() })
    }
  },
  async copyWeek(context, payload) {
    // Get schedule
    const schedule = context.getters["schedules"][payload.from]

    // Update locally
    context.commit("setSchedule", {
      weekId: payload.to,
      schedule,
    })

    // Update DB
    db.collection("schedules")
      .doc(payload.to)
      .set(schedule)
  },
}
