import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

function accountEmail(username) {
  var key = Array.from(username).map(function (character) { return character.codePointAt(0).toString(16); }).join("-");
  return "user-" + key + "@kylesworld.app";
}

async function saveAccount(username, account) {
  var cloudAccount = Object.assign({}, account);
  delete cloudAccount.password;
  await setDoc(doc(database, "accounts", auth.currentUser.uid), { username: username, account: cloudAccount, updatedAt: Date.now() });
}

async function readAccount() {
  var accountSnapshot = await getDoc(doc(database, "accounts", auth.currentUser.uid));
  return accountSnapshot.exists() ? accountSnapshot.data().account : null;
}

window.firebaseCloud = {
  ready: signInAnonymously(auth),
  register: async function (username, password, account) {
    await createUserWithEmailAndPassword(auth, accountEmail(username), password);
    await saveAccount(username, account);
    return account;
  },
  login: async function (username, password) {
    await signInWithEmailAndPassword(auth, accountEmail(username), password);
    return readAccount();
  },
  saveAccount: saveAccount,
  publish: async function (username, account) {
    await this.ready;
    await setDoc(doc(database, "leaderboard", auth.currentUser.uid), {
      username: username,
      balance: account.balance,
      dailyEarnings: account.dailyEarnings || 0,
      profilePic: account.profilePic || "",
      updatedAt: Date.now()
    });
  },
  subscribe: function (callback) {
    return onSnapshot(collection(database, "leaderboard"), function (snapshot) {
      callback(snapshot.docs.map(function (entry) { return entry.data(); }));
    });
  }
};