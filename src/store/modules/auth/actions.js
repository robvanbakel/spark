import auth from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default {
  async login(context, payload) {
    try {
      const res = await signInWithEmailAndPassword(auth, payload.email, payload.password);
      return res;
    } catch (err) {
      return err;
    }
  },
  logout() {
    signOut(auth);
    window.location.reload();
  },
};
