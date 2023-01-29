import { defineStore } from "pinia";
import type { Notification } from "@/types/notifications";

interface State {
  notifications: Notification[];
}

export default defineStore("notifications", {
  state: (): State => ({
    notifications: [],
  }),
  actions: {
    addNotification(notification: Omit<Notification, "id">) {
      const notificationId = crypto.randomUUID();

      this.notifications.push({
        id: notificationId,
        leaving: false,
        ...notification,
      });
    },
    removeNotification(notificationId: Notification["id"]) {
      const target = this.notifications.find(
        (notification) => notification.id === notificationId
      );

      if (!target) return;

      target.leaving = true;

      setTimeout(() => {
        this.notifications = this.notifications.filter(
          (notification) => notification.id !== target.id
        );
      }, 160);
    },
  },
  getters: {
    notificationVisibilityDuration(): number {
      return 3000;
    },
  },
});
