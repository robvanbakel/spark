import { defineStore } from "pinia";

import type { Admin, Employee } from "@/types/employees";

import api from "@/utils/api";
import format from "@/utils/format";

import { useAuth } from "@/store";

import auth from "@/firebase";

interface State {
  users: (Admin | Employee)[];
  totalHours: Record<string, number>;
  activeUserId: string | null;
}

export default defineStore("employees", {
  state: (): State => ({
    users: [],
    totalHours: {},
    activeUserId: null,
  }),
  actions: {
    async getUsers() {
      const users = await api.get("db/users");

      const authStore = useAuth();

      if (!Array.isArray(users)) {
        authStore.user = users;
        return;
      }

      authStore.user = users.find((user) => user.id === auth.currentUser?.uid);

      this.users = users;
    },
    addNewUser() {
      this.activeUserId = "NEW";
    },
    async saveEditUser(payload: Employee) {
      const res = await api[payload.status === "NEW" ? "post" : "patch"](
        `db/users/${payload.id}`,
        format.users.req(payload)
      );

      if (res.ok) {
        if (payload.status === "NEW") {
          this.users.push({
            ...payload,
            status: "STAGED",
          });

          return;
        }

        this.users = this.users.map((user) => {
          if (user.id !== payload.id) return user;
          return { ...user, ...payload };
        });
        return;
      }

      throw await res.json();
    },
    getUser(userId: string) {
      return this.users.find((user) => user.id === userId);
    },
  },
  getters: {
    employees(): Employee[] {
      return this.users
        .filter((emp): emp is Employee => {
          return emp.status !== "ARCHIVED" && !emp.admin;
        })
        .sort((a, b) => b.createdAt - a.createdAt);
    },
  },
});
