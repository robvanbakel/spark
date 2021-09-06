import { auth } from '@/firebase'
import { db } from '@/firebase'

import router from '@/router'

export default {
  async getCurrentUser(context) {

    const res = await db.collection("employers").doc(auth.currentUser.uid).get();
    const data = await res.data()
   
    context.commit('setUser', data)
    context.commit('setMode', 'employer')
    
  },
  async login(context, payload) {

    try {
      const res = await auth.signInWithEmailAndPassword(payload.email, payload.password)
      router.push({ name: 'EmployeeList' })
      return res
    } catch (err) {
      console.log(err)
      return err
    }

  },
  logout() {

    auth.signOut()
    router.push({ name: 'Auth' })

  },
}