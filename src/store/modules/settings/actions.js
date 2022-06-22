import firebase from 'firebase/app';
import { db, auth } from '@/firebase';

export default {
  async getSettings(context) {
    const idToken = await auth.currentUser.getIdToken();

    const res = await fetch(`${import.meta.env.VITE_ADMIN_HOST || ''}/admin/db/settings`, {
      headers: { authorization: idToken },
    });

    const settings = await res.json();

    if (!settings) return;

    settings.forEach((doc) => {
      switch (doc.id) {
        case 'suggestions':
          context.commit('suggestions', doc.suggestions);
          break;
        case 'admin':
          context.commit('admin', doc.admin);
          break;
        case 'roles':
          context.commit('roles', doc.roles);
          break;
        case 'shareWithEmployees':
          context.commit('shareWithEmployees', doc);
          break;
        case 'dateNotation':
          context.commit('dateNotation', doc.dateNotation);
          break;
        case 'location':
          context.commit('location', doc);
          break;
        default:
          break;
      }
    });
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
  async dateNotation(context, payload) {
    // Update locally
    context.commit('dateNotation', payload);

    // Update DB
    await db
      .collection('settings')
      .doc('dateNotation')
      .update({ dateNotation: payload });

    // Send call to server to update stored settings
    fetch(`${import.meta.env.VITE_ADMIN_HOST || ''}/admin/updateSettings`);
  },
  async location(context, payload) {
    // Update locally
    context.commit('location', payload);

    // Update DB
    await db
      .collection('settings')
      .doc('location')
      .update(payload);

    // Send call to server to update stored settings
    fetch(`${import.meta.env.VITE_ADMIN_HOST || ''}/admin/updateSettings`);
  },
  async setShareWithEmployees(context, payload) {
    // Update locally
    context.commit('shareWithEmployees', payload);

    // Update DB
    await db
      .collection('settings')
      .doc('shareWithEmployees')
      .update(payload);

    // Send call to server to update stored settings
    fetch(`${import.meta.env.VITE_ADMIN_HOST || ''}/admin/updateSettings`);
  },
};
