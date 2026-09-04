import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaqrUN6AVUZo7ffxxkSE2cSM23TRRypAM",
  authDomain: "trading-5158a.firebaseapp.com",
  projectId: "trading-5158a",
  storageBucket: "trading-5158a.firebasestorage.app",
  messagingSenderId: "389277253708",
  appId: "1:389277253708:web:3df714a50496f241eb74e9",
  measurementId: "G-2VJN7SV5FG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

window.firebaseCloud = {
  ready: signInAnonymously(auth),
  publish: async function (username, account) {
    await this.ready;
    await setDoc(doc(database, "leaderboard", auth.currentUser.uid), {
      username: username,
      balance: account.balance,
      dailyEarnings: account.dailyEarnings || 0,
      updatedAt: Date.now()
    });
  },
  subscribe: function (callback) {
    return onSnapshot(collection(database, "leaderboard"), function (snapshot) {
      callback(snapshot.docs.map(function (entry) { return entry.data(); }));
    });
  }
};