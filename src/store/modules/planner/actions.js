import { db } from '@/firebase'

export default {
  setActiveShift(context, payload) {

    if (payload) {

      const { weekId, day, employeeId } = payload
      const shift = context.getters.schedules[weekId][employeeId][day];
      const employee = context.rootGetters["employees/employees"].find((emp) => emp.id === employeeId);

      const parseTime = (time) => {
        return time.substring(0, 2) + ":" + time.substring(2, 4);
      };

      const parseDate = () => {
        const [month, date, year] = context.rootGetters['date/dates'][day]
          .toLocaleDateString({ year: 'numeric', month: 'numeric', day: 'numeric', })
          .split('/')

        return `${date.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`
      }

      context.commit('activeShift', {
        weekId,
        day,
        employeeId,
        shift: {
          employee: {
            fullName: `${employee.firstName} ${employee.lastName}`,
            id: employeeId,
          },
          place: shift.place,
          date: parseDate(),
          start: parseTime(shift.start),
          end: parseTime(shift.end),
          break: shift.break,
          notes: shift.notes,
        }
      })

    } else {
      context.commit('activeShift', null)
    }

  },
  newShift(context, payload) {
    context.commit('newShift', payload)
  },
  async addNewShift(context, payload) {

    // Update DB
    const res = await db.collection('schedules').add(payload);

    // Update locally
    context.commit('updateShiftLocally', {
      newShiftId: res.id,
      shift: payload
    })

  },
  saveEditShift(context, payload) {

    // Update DB
    db.collection('schedules').doc(context.getters.activeShiftId).update(payload);

    // Update locally
    context.commit('updateShiftLocally', {
      activeShiftId: context.getters.activeShiftId,
      shift: payload
    })

  },
  deleteShift(context) {

    // Update DB
    db.collection('schedules').doc(context.getters.activeShiftId).delete();

    // Update locally
    context.commit('removeShiftLocally', context.getters.activeShiftId)

  },
  async getSchedules(context) {

    let schedules = {}

    const snapshot = await db.collection('schedules').get();
    snapshot.forEach(doc => {
      schedules[doc.id] = doc.data()
    });

    context.commit('schedules', schedules);

  },
}