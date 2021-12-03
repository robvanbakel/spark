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
        case "dateNotation":
          context.commit("dateNotation", data.dateNotation)
          break
        case "location":
          context.commit("location", data)
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
  async dateNotation(context, payload) {
    // Update locally
    context.commit("dateNotation", payload)

    // Update DB
    await db
      .collection("settings")
      .doc("dateNotation")
      .update({ dateNotation: payload })

    // Send call to server to update stored settings
    fetch(`${process.env.VUE_APP_ADMIN_HOST || ""}/admin/updateSettings`)
  },
  async location(context, payload) {
    // Update locally
    context.commit("location", payload)

    // Update DB
    await db
      .collection("settings")
      .doc("location")
      .update(payload)

    // Send call to server to update stored settings
    fetch(`${process.env.VUE_APP_ADMIN_HOST || ""}/admin/updateSettings`)
  },
  async setShareWithEmployees(context, payload) {
    // Update locally
    context.commit("shareWithEmployees", payload)

    // Update DB
    await db
      .collection("settings")
      .doc("shareWithEmployees")
      .update(payload)

    // Send call to server to update stored settings
    fetch(`${process.env.VUE_APP_ADMIN_HOST || ""}/admin/updateSettings`)
  },
}
