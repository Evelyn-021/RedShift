import Phaser from "phaser";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  doc,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

// 🔹 Tu configuración de Firebase (RedShift)
const firebaseConfig = {
  apiKey: "AIzaSyAptrDpqBsDT4cthEaTSmnKfVVK3_xJFIs",
  authDomain: "redshift-dcd0c.firebaseapp.com",
  projectId: "redshift-dcd0c",
  storageBucket: "redshift-dcd0c.firebasestorage.app",
  messagingSenderId: "385820789481",
  appId: "1:385820789481:web:99db186b9595f55a307e78"
};



// 🔸 Exportamos la clase del plugin
export default class FirebasePlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.auth = getAuth(app);
    this.onLoggedInCallback = () => {};

    this.authStateChangedUnsubscribe = onAuthStateChanged(this.auth, (user) => {
      if (user && this.onLoggedInCallback) {
        this.onLoggedInCallback(user);
      }
    });
  }

  destroy() {
    this.authStateChangedUnsubscribe();
    super.destroy();
  }

  onLoggedIn(callback) {
    this.onLoggedInCallback = callback;
  }

  async saveGameData(userId, data) {
    await setDoc(doc(this.db, "game-data", userId), data);
  }

  async loadGameData(userId) {
    const snap = await getDoc(doc(this.db, "game-data", userId));
    return snap.data();
  }

  async createUserWithEmail(email, password) {
    const credentials = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return credentials.user;
  }

  async signInWithEmail(email, password) {
    const credentials = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    return credentials.user;
  }

  async signInAnonymously() {
    const credentials = await signInAnonymously(this.auth);
    console.log("✅ Usuario anónimo:", credentials.user.uid);
    return credentials.user;
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credentials = await signInWithPopup(this.auth, provider);
    console.log("✅ Usuario Google:", credentials.user.displayName);
    return credentials.user;
  }

  async signInWithGithub() {
    const provider = new GithubAuthProvider();
    const credentials = await signInWithPopup(this.auth, provider);
    console.log("✅ Usuario GitHub:", credentials.user.displayName);
    return credentials.user;
  }

  getUser() {
    return this.auth.currentUser;
  }

  async addHighScore(name, score) {
    await addDoc(collection(this.db, "high-scores"), {
      name,
      score,
      createdAt: new Date(),
    });
  }

  async getHighScores() {
    const q = query(
      collection(this.db, "high-scores"),
      orderBy("score", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((d) => {
      scores.push(d.data());
    });

    return scores;
  }
}
