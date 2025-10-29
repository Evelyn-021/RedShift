import Phaser from "phaser";

// 📦 Detectamos el modo actual (arcade o production)
const mode = import.meta.env.VITE_MODE;

// 🔸 Variables que solo inicializamos si es modo producción
let initializeApp, getFirestore, getAuth;
let createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, signInWithPopup;
let onAuthStateChanged, GoogleAuthProvider, GithubAuthProvider;
let setDoc, doc, addDoc, collection, query, orderBy, limit, getDocs, getDoc;

// ⚙️ Cargamos dinámicamente los módulos de Firebase solo en producción
if (mode === "production") {
  console.log("🌐 Modo producción: inicializando Firebase...");
  const firebaseApp = await import("firebase/app");
  const firestore = await import("firebase/firestore");
  const auth = await import("firebase/auth");

  initializeApp = firebaseApp.initializeApp;
  getFirestore = firestore.getFirestore;
  setDoc = firestore.setDoc;
  doc = firestore.doc;
  addDoc = firestore.addDoc;
  collection = firestore.collection;
  query = firestore.query;
  orderBy = firestore.orderBy;
  limit = firestore.limit;
  getDocs = firestore.getDocs;
  getDoc = firestore.getDoc;

  getAuth = auth.getAuth;
  createUserWithEmailAndPassword = auth.createUserWithEmailAndPassword;
  signInWithEmailAndPassword = auth.signInWithEmailAndPassword;
  signInAnonymously = auth.signInAnonymously;
  signInWithPopup = auth.signInWithPopup;
  onAuthStateChanged = auth.onAuthStateChanged;
  GoogleAuthProvider = auth.GoogleAuthProvider;
  GithubAuthProvider = auth.GithubAuthProvider;
} else {
  console.log("🎮 Modo arcade: Firebase deshabilitado.");
}

// 🔹 Configuración de Firebase (usa tus variables del .env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// 🔸 Clase del Plugin de Firebase
export default class FirebasePlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);

    // Si estamos en arcade, no inicializamos nada
    if (mode !== "production") {
      console.warn("🚫 Firebase deshabilitado en modo arcade.");
      return;
    }

    // Si es producción, inicializamos normalmente
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.auth = getAuth(app);
    this.onLoggedInCallback = () => {};

    this.authStateChangedUnsubscribe = onAuthStateChanged(this.auth, (user) => {
      if (user && this.onLoggedInCallback) {
        this.onLoggedInCallback(user);
      }
    });

    console.log("✅ Firebase inicializado correctamente");
  }

  destroy() {
    if (this.authStateChangedUnsubscribe) this.authStateChangedUnsubscribe();
    super.destroy();
  }

  onLoggedIn(callback) {
    this.onLoggedInCallback = callback;
  }

  // 🧩 Métodos principales de Firebase Auth
  async createUserWithEmail(email, password) {
    if (mode !== "production") return console.warn("Firebase no disponible en modo arcade");
    const credentials = await createUserWithEmailAndPassword(this.auth, email, password);
    return credentials.user;
  }

  async signInWithEmail(email, password) {
    if (mode !== "production") return console.warn("Firebase no disponible en modo arcade");
    const credentials = await signInWithEmailAndPassword(this.auth, email, password);
    return credentials.user;
  }

  async signInAnonymously() {
    if (mode !== "production") return console.warn("Firebase no disponible en modo arcade");
    const credentials = await signInAnonymously(this.auth);
    console.log("✅ Usuario anónimo:", credentials.user.uid);
    return credentials.user;
  }

  async signInWithGoogle() {
    if (mode !== "production") return console.warn("Firebase no disponible en modo arcade");
    const provider = new GoogleAuthProvider();
    const credentials = await signInWithPopup(this.auth, provider);
    console.log("✅ Usuario Google:", credentials.user.displayName);
    return credentials.user;
  }

  async signInWithGithub() {
    if (mode !== "production") return console.warn("Firebase no disponible en modo arcade");
    const provider = new GithubAuthProvider();
    const credentials = await signInWithPopup(this.auth, provider);
    console.log("✅ Usuario GitHub:", credentials.user.displayName);
    return credentials.user;
  }

  getUser() {
    if (mode !== "production") return null;
    return this.auth.currentUser;
  }

  // 🧠 Métodos para guardar/cargar datos
  async saveGameData(userId, data) {
    if (mode !== "production") return console.warn("Firebase no disponible en modo arcade");
    await setDoc(doc(this.db, "game-data", userId), data);
  }

  async loadGameData(userId) {
    if (mode !== "production") return console.warn("Firebase no disponible en modo arcade");
    const snap = await getDoc(doc(this.db, "game-data", userId));
    return snap.data();
  }

  async addHighScore(name, score) {
    if (mode !== "production") return console.warn("Firebase no disponible en modo arcade");
    await addDoc(collection(this.db, "high-scores"), {
      name,
      score,
      createdAt: new Date(),
    });
  }

  async getHighScores() {
    if (mode !== "production") return console.warn("Firebase no disponible en modo arcade");
    const q = query(collection(this.db, "high-scores"), orderBy("score", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((d) => scores.push(d.data()));
    return scores;
  }
}
