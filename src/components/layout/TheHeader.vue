<template>
  <header>
    <div id="logo">
      <router-link :to="{ name: 'Home' }">
        <img src="@/assets/logo.svg" alt="Planner" />
      </router-link>
    </div>
    <nav>
      <ul>
        <li v-if="employee"><router-link :to="{ name: 'Schedule' }">Schedule</router-link></li>
        <li v-if="admin"><router-link :to="{ name: 'EmployeeList' }">Staff</router-link></li>
        <li v-if="admin"><router-link :to="{ name: 'Planner' }">Planner</router-link></li>
      </ul>
    </nav>
    <div id="profile" @click="logout">
      <div class="profile-info">
        <span class="profile-name">{{ user.firstName }} {{ user.lastName }}</span>
        <span class="profile-account">{{ user.email }}</span>
      </div>
      <div class="profile-avatar">
        <span class="material-icons material-icons-round">person</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters["auth/user"]
    },
    admin() {
      return this.$store.getters["auth/admin"]
    },
    employee() {
      return this.$store.getters["auth/user"].status !== 'admin'
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout")
    },
  },
}
</script>
