<script setup lang="ts">
import { ref } from "vue";
import { useEmployees } from "@/store";
import { useRoute } from "vue-router";
import SideMenu from "@/components/layout/SideMenu.vue";
import type { MenuItem } from "@/types/global";

const employeesStore = useEmployees();

const route = useRoute();

const user = employeesStore.getUser(route.params.id as string);

const items: MenuItem[][] = [
  [
    {
      title: "Personal",
      icon: "person",
      hash: "#personal",
    },
    {
      title: "Financial",
      icon: "account_balance",
      hash: "#financial",
    },
    {
      title: "Documents",
      icon: "description",
      hash: "#documents",
    },
    {
      title: "Reports",
      icon: "insights",
      hash: "#reports",
    },
  ],
  [
    {
      title: "Availability",
      icon: "calendar_month",
      hash: "#availability",
    },
    {
      title: "Notifications",
      icon: "notifications",
      hash: "#notifications",
    },
    {
      title: "Settings",
      icon: "settings",
      hash: "#settings",
    },
  ],
];

const activeRoute = ref();
</script>

<template>
  <div id="user-settings">
    <side-menu v-model="activeRoute" :items="items">
      <template #header>
        <div class="slot-header">
          <span class="name">{{ user?.firstName }} {{ user?.lastName }}</span>
          <span class="email">{{ user?.email }}</span>
        </div>
      </template>
    </side-menu>
    <main>
      <section>
        <h1>{{ activeRoute?.title }}</h1>
      </section>
    </main>
  </div>
</template>
