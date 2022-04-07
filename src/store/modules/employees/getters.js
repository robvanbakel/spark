export default {
  users(state) {
    return state.users;
  },
  employees(state) {
    return state.users
      .filter((emp) => emp.status != 'archived' && emp.status != 'admin')
      .sort((a, b) => b.createdAt - a.createdAt);
  },
  totalHours(state, getters, rootState, rootGetters) {
    const totalHours = {};

    getters.employees.forEach((employee) => {
      let total = 0;

      if (rootGetters['planner/currentWeekSchedule']) {
        rootGetters['planner/currentWeekSchedule'][employee.id]?.forEach((shift) => {
          if (shift) {
            const [startHours, startMinutes] = shift.start.match(/\d{2}/g);
            const [endHours, endMinutes] = shift.end.match(/\d{2}/g);

            const start = new Date(0);
            start.setHours(startHours);
            start.setMinutes(startMinutes);
            const end = new Date(0);

            end.setHours(endHours);
            end.setMinutes(endMinutes);

            const totalHours = Math.abs(start - end);

            total += totalHours / 1000 / 60 / 60;
            total -= shift.break / 60;
          }
        });
      }

      totalHours[employee.id] = total.toFixed(2);
    });

    return totalHours;
  },
};
