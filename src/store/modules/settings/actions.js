import firebase from 'firebase/app'
import { db } from '@/firebase'


export default {
  async getSettings(context) {

    let suggestions = []

    const snapshot = await db.collection('settings').get();
    snapshot.forEach(doc => {
      switch (doc.id) {
        case 'suggestions':
          suggestions = doc.data().suggestions
          break;
      }
    })

    context.commit('suggestions', suggestions);

  },
  addSuggestion(context, payload) {

    // Update DB
    db.collection("settings").doc("suggestions").update({
      suggestions: firebase.firestore.FieldValue.arrayUnion(payload.suggestion)
    });

    // Update locally
    const suggestions = context.getters.suggestions
    suggestions.push(payload.suggestion)
    context.commit('suggestions', suggestions);
  },
  deleteSuggestion(context, payload) {

    payload.event.preventDefault()

    // UpdateDB
    db.collection("settings").doc("suggestions").update({
      suggestions: firebase.firestore.FieldValue.arrayRemove(payload.suggestion)
    });

    // Update locally
    let suggestions = context.getters.suggestions
    suggestions = suggestions.filter(suggestion => suggestion != payload.suggestion)
    context.commit('suggestions', suggestions);

  },

}