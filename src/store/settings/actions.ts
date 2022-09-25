import api from "@/utils/api";
import format from "@/utils/format";

export default {
  async getSettings() {
    this.settings = await api.get("db/settings");
  },
  saveSettings(payload) {
    api.patch(`db/admin/${payload.id}`, format.settings.req(payload));
    this.settings = payload;
  },
  addSuggestion(suggestion) {
    this.saveSettings({
      ...this.settings,
      suggestions: [...this.settings.suggestions, suggestion],
    });
  },
  deleteSuggestion(suggestion) {
    this.saveSettings({
      ...this.settings,
      suggestions: this.settings.suggestions.filter((v) => v !== suggestion),
    });
  },
  toggleSidebar() {
    this.sidebarHidden = !this.sidebarHidden;
  },
};
