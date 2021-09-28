import firebase from "firebase/app"
import { db } from "@/firebase"

export default {
  async getSettings(context) {
    const snapshot = await db.collection("settings").get()
    snapshot.forEach((doc) => {
      const data = doc.data()

      switch (doc.id) {
        case "suggestions":
          context.commit("suggestions", data.suggestions)
          break
        case "admin":
          context.commit("admin", data.admin)
          break
        case "roles":
          context.commit("roles", data.roles)
          break
        case "shareWithEmployees":
          context.commit("shareWithEmployees", data)
          break
      }
    })
  },
  addSuggestion(context, payload) {
    // Update DB
    db.collection("settings")
      .doc("suggestions")
      .update({
        suggestions: firebase.firestore.FieldValue.arrayUnion(payload.suggestion),
      })

    // Update locally
    const suggestions = context.getters.suggestions
    suggestions.push(payload.suggestion)
    context.commit("suggestions", suggestions)
  },
  deleteSuggestion(context, payload) {
    payload.event.preventDefault()

    // UpdateDB
    db.collection("settings")
      .doc("suggestions")
      .update({
        suggestions: firebase.firestore.FieldValue.arrayRemove(payload.suggestion),
      })

    // Update locally
    let suggestions = context.getters.suggestions
    suggestions = suggestions.filter((suggestion) => suggestion != payload.suggestion)
    context.commit("suggestions", suggestions)
  },
  toggleSidebar(context) {
    context.commit("toggleSidebar")
  },
  hideSidebar(context, payload) {
    context.commit("hideSidebar", payload)
  },
  sidebarAutoHidden(context, payload) {
    context.commit("sidebarAutoHidden", payload)
  },
  setShareWithEmployees(context, payload) {
    // Update DB
    db.collection("settings")
      .doc("shareWithEmployees")
      .update(payload)

    // Update locally
    context.commit("shareWithEmployees", payload)
  },
}
