<template>
  <header>
    <div id="logo">
      <router-link :to="{ name: 'Home' }">
        <img src="@/assets/logo.svg" alt="Spark" />
      </router-link>
    </div>
    <nav>
      <ul>
        <li v-if="employee">
          <router-link :to="{ name: 'Schedule' }">Schedule</router-link>
        </li>
        <li v-if="admin">
          <router-link :to="{ name: 'EmployeeList' }">Staff</router-link>
        </li>
        <li v-if="admin">
          <router-link :to="{ name: 'Planner' }">Planner</router-link>
        </li>
        <li v-if="admin">
          <router-link :to="{ name: 'Settings' }">Settings</router-link>
        </li>
      </ul>
    </nav>
    <div
      id="profile"
    >
      <div class="profile-info" v-if="icon !== 'logout'">
        <span class="profile-name"
          >{{ user.firstName }} {{ user.lastName }}</span
        >
        <span class="profile-account">{{ user.email }}</span>
      </div>
      <div class="profile-info" v-else>
        <span class="profile-name">Logout</span>
      </div>
      <div class="profile-avatar"  @click="logout"
      @mouseover="icon = 'logout'"
      @mouseleave="icon = 'person'">
        <span class="material-icons material-icons-round">{{ icon }}</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      icon: "person",
    };
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    admin() {
      return this.$store.getters["auth/admin"];
    },
    employee() {
      return this.$store.getters["auth/user"].status !== "admin";
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
    },
  },
};
</script>
