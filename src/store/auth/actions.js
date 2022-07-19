import auth from '@/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useSettings } from '@/store';

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
    useSettings().isLoaded = false;
    signOut(auth);
  },
};
