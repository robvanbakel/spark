<script setup>
import { ref } from 'vue';
import { useEmployees } from '@/store';
import { useRoute } from 'vue-router';
import SideMenu from '@/components/layout/SideMenu.vue';

const employeesStore = useEmployees();

const route = useRoute();

const user = employeesStore.getUser(route.params.id);

const items = [
  {
    title: 'Personal',
    icon: 'person',
    hash: '#personal',
  },
  {
    title: 'Financial',
    icon: 'account_balance',
    hash: '#financial',
  },
  {
    title: 'Documents',
    icon: 'description',
    hash: '#documents',
  },
  {
    title: 'Reports',
    icon: 'insights',
    hash: '#reports',
  },
  {
    divider: true,
  },
  {
    title: 'Availability',
    icon: 'calendar_month',
    hash: '#availability',
  },
  {
    title: 'Notifications',
    icon: 'notifications',
    hash: '#notifications',
  },
  {
    title: 'Settings',
    icon: 'settings',
    hash: '#settings',
  },
];

const activeRoute = ref({});

</script>

<template>
  <div id="user-settings">
    <side-menu
      v-model="activeRoute"
      :items="items"
    >
      <div class="slot-header">
        <span class="name">{{ user.firstName }} {{ user.lastName }}</span>
        <span class="email">{{ user.email }}</span>
      </div>
    </side-menu>
    <main>
      <section>
        <h1>{{ activeRoute?.title }}</h1>
      </section>
    </main>
  </div>
</template>
