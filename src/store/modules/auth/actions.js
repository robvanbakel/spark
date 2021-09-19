import { auth } from "@/firebase"

import router from "@/router"

export default {
  async login(context, payload) {
    try {
      const res = await auth.signInWithEmailAndPassword(payload.email, payload.password)
      return res
    } catch (err) {
      console.log(err)
      return err
    }
  },
  logout(context) {
    auth.signOut()

    // Reset data
    context.commit("planner/schedules", null, { root: true })
    context.commit("employees/setEmployees", null, { root: true })

    router.push({ name: "Auth" })
  },
}
