import auth from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default {
  async login({ email, password }) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
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
