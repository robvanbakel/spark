<script setup lang="ts">
import { onMounted, computed } from "vue";
import { type Notification, NotificationType } from "@/types/notifications";
import { useNotifications } from "@/store";

const notificationStore = useNotifications();

const props = defineProps<{
  notification: Notification;
}>();

const color = computed(() => {
  switch (props.notification.type) {
    case NotificationType.SUCCESS:
      return "green";
    case NotificationType.ERROR:
      return "red";
    default:
      return "blue";
  }
});

onMounted(() => {
  if (props.notification.persistent) return;

  setTimeout(() => {
    notificationStore.removeNotification(props.notification.id);
  }, notificationStore.notificationVisibilityDuration);
});
</script>

<template>
  <Transition appear name="fade">
    <div class="notification" v-if="!notification.leaving" :class="color">
      <span
        v-if="notification.persistent"
        class="material-icons material-icons-round close"
        @click="notificationStore.removeNotification(notification.id)"
        >clear</span
      >
      <h5>{{ notification.title }}</h5>
      <p>{{ notification.message }}</p>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-enter-active {
  transition: all 120ms ease-out;
}

.fade-leave-active {
  transition: all 160ms ease-in;
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
