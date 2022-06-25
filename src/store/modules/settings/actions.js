import firebase from 'firebase/app';
import api from '@/utils/api';
import format from '@/utils/format';

import { db } from '@/firebase';

export default {
  async getSettings(context) {
    const settings = await api.get('db/settings');
    context.commit('settings', settings);
  },
  saveSettings(context, payload) {
    api.patch(`db/admin/${payload.id}`, format.settings.req(payload));
    context.commit('settings', payload);
  },
  addSuggestion(context, payload) {
    // Update DB
    db.collection('settings')
      .doc('suggestions')
      .update({
        suggestions: firebase.firestore.FieldValue.arrayUnion(payload.suggestion),
      });

    // Update locally
    const { suggestions } = context.getters;
    suggestions.push(payload.suggestion);
    context.commit('suggestions', suggestions);
  },
  deleteSuggestion(context, payload) {
    payload.event.preventDefault();

    // UpdateDB
    db.collection('settings')
      .doc('suggestions')
      .update({
        suggestions: firebase.firestore.FieldValue.arrayRemove(payload.suggestion),
      });

    // Update locally
    let { suggestions } = context.getters;
    suggestions = suggestions.filter((suggestion) => suggestion !== payload.suggestion);
    context.commit('suggestions', suggestions);
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
