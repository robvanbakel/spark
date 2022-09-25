import { defineStore } from "pinia";

import api from "@/utils/api";
import format from "@/utils/format";

import type { Settings } from "@/types/settings";

interface State {
  sidebarHidden: boolean;
  sidebarAutoHidden: boolean;
  settings: Settings | null;
  isLoaded: boolean;
  dateLocale: string;
  breaks: string[];
  statuses: string[];
}

export default defineStore("settings", {
  state: (): State => ({
    sidebarHidden: false,
    sidebarAutoHidden: false,
    settings: null,
    isLoaded: false,
    dateLocale: "en-US",
    breaks: ["0", "15", "30", "45", "60"],
    statuses: ["ACTIVE", "UNAVAILABLE", "SICK", "INACTIVE", "STAGED"],
  }),
  actions: {
    async getSettings() {
      this.settings = await api.get("db/settings");
    },
    saveSettings(payload: Settings) {
      api.patch(`db/admin/${payload.id}`, format.settings.req(payload));
      this.settings = payload;
    },
    addSuggestion(suggestion: string) {
      if (!this.settings) return;
      this.saveSettings({
        ...this.settings,
        suggestions: [...this.settings.suggestions, suggestion],
      });
    },
    deleteSuggestion(suggestion: string) {
      if (!this.settings) return;
      this.saveSettings({
        ...this.settings,
        suggestions: this.settings.suggestions.filter((v) => v !== suggestion),
      });
    },
    toggleSidebar() {
      this.sidebarHidden = !this.sidebarHidden;
    },
  },
  getters: {
    mode() {
      return window.location.hostname.split(".")[0];
    },
  },
});
