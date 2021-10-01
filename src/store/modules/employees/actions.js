import { auth } from "@/firebase"
import { db } from "@/firebase"

import router from "@/router"

export default {
  async getUsers(context) {
    const uid = auth.currentUser.uid

    if (context.rootGetters["settings/admin"].includes(uid)) {
      // Set global auth/admin variable to true
      context.commit("auth/admin", true, { root: true })

      let users = []

      // If user is admin, load all users from database
      const snapshot = await db.collection("users").get()
      snapshot.forEach((doc) => {
        const user = {
          id: doc.id,
          ...doc.data(),
        }

        users.push(user)

        if (user.id === uid) {
          context.commit("auth/setUser", user, { root: true })
        }
      })

      context.commit("setUsers", users)

      router.push({ name: "EmployeeList" })
    } else {
      // Set global auth/admin variable to false
      context.commit("auth/admin", false, { root: true })

      // If user is not admin, load only own data from database
      const doc = await db
        .collection("users")
        .doc(uid)
        .get()

      const user = {
        id: doc.id,
        ...doc.data(),
      }

      context.commit("auth/setUser", user, { root: true })

      router.push({ name: "Schedule" })
    }
  },
  async updateUser(context, payload) {
    // Update locally
    context.commit("updateUser", payload)

    // Update DB
    db.collection("users")
      .doc(payload.id)
      .update(payload.data)
  },
  async createNewUser(context, payload) {
    // Create new user on Firebase
    const res = await fetch(`${process.env.VUE_APP_ADMIN_HOST || ""}/createNewUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.user.email,
      }),
    })

    // Get uid for new user from response object
    const { uid } = await res.json()

    // Update locally
    context.commit("addUser", {
      id: uid || new Date().toISOString(), // Fallback fake uid for demo environment
      data: payload.user,
    })

    // Update DB
    db.collection("users")
      .doc(uid)
      .set(payload.user)
  },
}
