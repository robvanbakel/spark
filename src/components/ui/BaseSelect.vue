<template>
  <select class="base-select" @change="chooseEmployee" v-model="selectedEmployee">
    <option
      v-for="employee in this.$store.getters['employees/employees']"
      :key="employee.id"
      :value="{ id: employee.id, fullName: `${employee.firstName} ${employee.lastName}` }"
      >{{ employee.firstName }} {{ employee.lastName }}</option
    >
  </select>
</template>

<script>
export default {
  emits: ["selectedEmployee"],
  props: ['selected'],
  data() {
    return {
      selectedEmployee: this.selected,
    };
  },
  methods: {
    chooseEmployee() {
      this.$emit("selectedEmployee", this.selectedEmployee);
    },
  },
};
</script>
