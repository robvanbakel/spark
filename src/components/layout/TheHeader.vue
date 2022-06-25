<template>
  <header>
    <div id="logo">
      <router-link :to="{ name: 'Home' }">
        <img
          src="@/assets/logo.svg"
          alt="Spark"
        >
      </router-link>
    </div>
    <nav>
      <ul>
        <li v-if="employee">
          <router-link :to="{ name: 'Schedule' }">
            {{ $t('schedule.menuLabel') }}
          </router-link>
        </li>
        <li v-if="admin">
          <router-link :to="{ name: 'EmployeeList' }">
            {{ $t('staff.menuLabel') }}
          </router-link>
        </li>
        <li v-if="admin">
          <router-link :to="{ name: 'Planner' }">
            {{ $t('planner.menuLabel') }}
          </router-link>
        </li>
        <li v-if="admin">
          <router-link :to="{ name: 'Settings' }">
            {{ $t('settings.menuLabel') }}
          </router-link>
        </li>
      </ul>
    </nav>
    <div id="profile">
      <div
        v-if="icon !== 'logout'"
        class="profile-info"
      >
        <span class="profile-name">{{ user.firstName }} {{ user.lastName }}</span>
        <span class="profile-account">{{ user.email }}</span>
      </div>
      <div
        v-else
        class="profile-info"
      >
        <span class="profile-name">{{ $t('general.actions.logout') }}</span>
      </div>
      <div
        class="profile-avatar"
        @click="logout"
        @mouseover="icon = 'logout'"
        @mouseleave="icon = 'person'"
      >
        <span class="material-icons material-icons-round">{{ icon }}</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      icon: 'person',
    };
  },
  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
    admin() {
      return this.$store.getters['auth/admin'];
    },
    employee() {
      return this.$store.getters['auth/user'].status !== 'ADMIN';
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
    },
  },
};
</script>
