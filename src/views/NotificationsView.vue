<script setup lang="ts">
import NotificationItem from "@/components/ui/NotificationItem.vue";
import { useNotifications } from "@/store";

const notificationsStore = useNotifications();
</script>

<template>
  <div id="notifications-view">
    <NotificationItem
      v-for="notification in notificationsStore.notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>
