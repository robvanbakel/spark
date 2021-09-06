<template>
  <header>
    <div id="logo">
      <router-link :to="{ name: 'Home' }">
        <img src="@/assets/logo.svg" alt="Planner" />
      </router-link>
    </div>
    <nav>
      <ul v-if="mode === 'employer'">
        <li><router-link :to="{ name: 'EmployeeList' }">Staff</router-link></li>
        <li><router-link :to="{ name: 'Planner' }">Planner</router-link></li>
      </ul>
      <ul v-if="mode === 'employee'">
        <li><router-link :to="{ name: 'Employee' }">Employee</router-link></li>
      </ul>
    </nav>
    <div id="profile" @click="logout">
      <div class="profile-info">
        <span class="profile-name" v-if="mode === 'employer'">{{ user.displayName }}</span>
        <span class="profile-name" v-if="mode === 'employee'">{{ user.firstName }} {{ user.lastName }}</span>
        <span class="profile-account">{{ user.email }}</span>
      </div>
      <div class="profile-avatar">
        <span v-if="mode === 'employer'" class="material-icons material-icons-round">apartment</span>
        <span v-if="mode === 'employee'" class="material-icons material-icons-round">person</span>
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
    mode() {
      return this.$store.getters["auth/mode"]
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout")
    },
  },
}
</script>
