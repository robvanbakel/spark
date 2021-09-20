import { auth } from "@/firebase"
import { db } from "@/firebase"

import router from "@/router"

export default {
  async getEmployees(context) {
    const uid = auth.currentUser.uid

    if (context.rootGetters["settings/admin"].includes(uid)) {
      // Set global auth/admin variable to false
      context.commit("auth/admin", true, { root: true })

      let employees = []

      // If user is admin, load all users from database
      const snapshot = await db.collection("users").get()
      snapshot.forEach((doc) => {
        const employee = {
          id: doc.id,
          ...doc.data(),
        }

        employees.push(employee)

        if (employee.id === uid) {
          context.commit("auth/setUser", employee, { root: true })
        }
      })

      context.commit("setEmployees", employees)

      router.push({ name: "EmployeeList" })
    } else {
      // Set global auth/admin variable to false
      context.commit("auth/admin", false, { root: true })

      // If user is not admin, load only own data from database
      const doc = await db
        .collection("users")
        .doc(uid)
        .get()

      context.commit(
        "auth/setUser",
        {
          id: doc.id,
          ...doc.data(),
        },
        { root: true }
      )

      router.push({ name: "Employee" })
    }
  },
  async updateUser(context, payload) {
    db.collection("users")
      .doc(payload.id)
      .update(payload.data)
    context.commit("updateEmployee", payload)
  },
  async createNewUser(context, payload) {
    const res = await fetch(`${process.env.VUE_APP_ADMIN_HOST || ""}/createNewUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.employee.email,
      }),
    })

    const { uid } = await res.json()

    // Update locally
    context.commit("addUser", {
      id: uid || new Date().toISOString(), // Fallback fake uid for demo environment
      data: payload.employee,
    })

    // Update DB
    db.collection("users")
      .doc(uid)
      .set(payload.employee)
  },
  async changePassword(context, payload) {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBFLbBatL0vytdPvyJyd4cXx3G-Cnm2u7Y`, {
      method: "POST",
      body: JSON.stringify({
        idToken: payload.idToken,
        password: payload.password,
        returnSecureToken: true,
      }),
    })

    const data = await res.json()

    context.commit("auth/setAuthData", data, { root: true })

    localStorage.setItem("idToken", data.idToken)
    localStorage.setItem("localId", data.localId)
  },
}
