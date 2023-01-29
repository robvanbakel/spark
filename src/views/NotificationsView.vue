<script setup lang="ts">
import NotificationItem from "@/components/ui/NotificationItem.vue";
import useNotificationsStore from "@/store/notifications";

const notificationsStore = useNotificationsStore();
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
