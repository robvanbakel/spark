import api from '@/utils/api';
import format from '@/utils/format';

export default {
  async getSettings(context) {
    const settings = await api.get('db/settings');
    context.commit('settings', settings);
  },
  saveSettings(context, payload) {
    api.patch(`db/admin/${payload.id}`, format.settings.req(payload));
    context.commit('settings', payload);
  },
  addSuggestion(context, suggestion) {
    context.dispatch('saveSettings', {
      ...context.getters.settings,
      suggestions: [
        ...context.getters.settings.suggestions,
        suggestion,
      ],
    });
  },
  deleteSuggestion(context, suggestion) {
    context.dispatch('saveSettings', {
      ...context.getters.settings,
      suggestions: context.getters.settings.suggestions.filter((v) => v !== suggestion),
    });
  },
  toggleSidebar(context) {
    context.commit('toggleSidebar');
  },
  hideSidebar(context, payload) {
    context.commit('hideSidebar', payload);
  },
  sidebarAutoHidden(context, payload) {
    context.commit('sidebarAutoHidden', payload);
  },
};
