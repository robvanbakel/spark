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
  logout() {
    auth.signOut()
    router.push({ name: "Auth" })
  },
}
