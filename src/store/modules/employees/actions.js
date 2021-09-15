import { auth } from "@/firebase"
import { db } from "@/firebase"

export default {
  async getEmployees(context) {
    const uid = auth.currentUser.uid
    let employees = []

    if (context.rootGetters["settings/admin"].includes(uid)) {
      context.commit("auth/admin", true, { root: true })
    } else {
      context.commit("auth/admin", false, { root: true })
    }

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
  },
  async updateUser(context, payload) {
    db.collection("users")
      .doc(payload.id)
      .update(payload.data)
    context.commit("updateEmployee", payload)
  },
  async createNewUser(context, payload) {
    const res = await fetch(`/createNewUser`, {
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
      data: payload.employee })

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
