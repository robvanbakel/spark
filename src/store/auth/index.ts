import { defineStore } from "pinia";

import type { Employee, Admin } from "@/types/employees";

import auth from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useSettings } from "@/store";

interface State {
  user: null | Admin | Employee;
}

export default defineStore("auth", {
  state: (): State => ({
    user: null,
  }),
  actions: {
    async login(payload: { email: string; password: string }) {
      try {
        const res = await signInWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        return res;
      } catch (err) {
        return err;
      }
    },
    logout() {
      useSettings().isLoaded = false;
      signOut(auth);
    },
  },
  getters: {
    isAdmin(): boolean {
      return !!this.user?.admin;
    },
  },
});
