<template>
  <div class="employee-info-wrapper">
    <h3>Profile</h3>
    <h4>Name</h4>
    <p>{{ user.firstName }} {{ user.lastName }}</p>
    <h4>Role</h4>
    <p>{{ user.role }}</p>
    <h4>Contract</h4>
    <p>{{ user.contract }} hours ({{ user.contractType }})</p>
    <h4>Email</h4>
    <p>{{ user.email }}</p>
    <h4>Phone</h4>
    <p>{{ user.phone }}</p>
    <div v-if="user.notes">
      <h4>Notes</h4>
      <p>{{ user.notes }}</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters["auth/user"]
    },
  },
}
</script>

<style></style>
