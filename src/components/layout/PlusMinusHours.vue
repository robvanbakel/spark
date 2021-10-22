<template>
  <div class="plus-minus-hours-wrapper" v-for="employee in $store.getters['employees/employees']" :key="employee.id">
    <div class="entry" v-if="employee.role.toLowerCase() === role && calculatePlusMinusHours(employee.id) != 0">
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
</template>

<script>
export default {
  props: ["role"],
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
  },
}
</script>

<style></style>
