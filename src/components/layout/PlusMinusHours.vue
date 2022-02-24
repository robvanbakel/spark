<template>
  <div class="plus-minus-hours-wrapper">
    <div class="plus-minus-hours-role-wrapper" v-for="role in roles" :key="role">
      <div v-for="employee in $store.getters['employees/employees']" :key="employee.id">
        <div
          class="entry"
          v-if="
            employee.role.toLowerCase() === role &&
              calculatePlusMinusHours(employee.id) != 0 &&
              computedShowAll(employee.id) &&
              employeeFullName(employee)
                .toLowerCase()
                .includes(searchInput.toLowerCase())
          "
        >
          <div class="hours">
            <span :class="calculatePlusMinusHours(employee.id) < 0 ? 'minus' : 'plus'">{{
              calculatePlusMinusHours(employee.id)
            }}</span>
          </div>
          <div class="employee-info">
            <span class="name">{{ employee.firstName }} {{ employee.lastName }}</span>
            <span class="role">{{ employee.role }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="show-all" @click="toggleShowAll">
      <div v-if="showAll">
        Show scheduled employees
        <span class="material-icons material-icons-round">expand_less</span>
      </div>
      <div v-else>
        Show all employees
        <span class="material-icons material-icons-round">expand_more</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['roles', 'search'],
  data() {
    return {
      showAll: true,
      searchInput: '',
    }
  },
  watch: {
    search: function(query) {
      this.searchInput = query
    },
  },
  methods: {
    calculatePlusMinusHours(employeeId) {
      const contractHours = this.$store.getters["employees/employees"].find((employee) => employee.id === employeeId)[
        "contract"
      ]
      const calculatedHours = this.$store.getters["employees/totalHours"][employeeId]

      let plusMinusHours = (calculatedHours - contractHours).toFixed(2)

      if (plusMinusHours > 0) {
        plusMinusHours = `+${plusMinusHours}`
      }

      return plusMinusHours
    },
    employeeFullName(employee) {
      return `${employee.firstName} ${employee.lastName}`
    },
    toggleShowAll() {
      this.showAll = !this.showAll
    },
    computedShowAll(employeeId) {
      if (this.showAll || this.$store.getters["employees/totalHours"][employeeId] > 0) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>

<style></style>
