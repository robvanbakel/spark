import { auth } from '@/firebase';

export default {
  async login(context, payload) {
    try {
      const res = await auth.signInWithEmailAndPassword(payload.email, payload.password);
      return res;
    } catch (err) {
      return err;
    }
  },
  logout() {
    auth.signOut();
    window.location.reload();
  },
};
