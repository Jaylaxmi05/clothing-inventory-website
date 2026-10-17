import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbuVZaV7-EjvIfmr_cziq93r7MXPw-xEM",
  authDomain: "threadstock-cb7ee.firebaseapp.com",
  projectId: "threadstock-cb7ee",
  storageBucket: "threadstock-cb7ee.firebasestorage.app",
  messagingSenderId: "1028788600759",
  appId: "1:1028788600759:web:768e8ee6f28b5ada1a7232",
  measurementId: "G-PDV7234CK1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const authForm = document.getElementById("authForm");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const submitBtn = document.getElementById("submitBtn");
const confirmWrap = document.getElementById("confirmWrap");
const confirmPassword = document.getElementById("confirmPassword");
const forgotBtn = document.getElementById("forgotBtn");
const googleBtn = document.getElementById("googleBtn");
const switchPrompt = document.getElementById("switchPrompt");
const switchLink = document.getElementById("switchLink");
const notice = document.getElementById("notice");

let mode = "login";

function showNotice(message, type = "error") {
  notice.textContent = message;
  notice.className = `notice show ${type}`;
}

function clearNotice() {
  notice.textContent = "";
  notice.className = "notice";
}

function setMode(nextMode) {
  mode = nextMode;
  const signup = mode === "signup";

  loginTab.classList.toggle("active", !signup);
  signupTab.classList.toggle("active", signup);
  formTitle.textContent = signup ? "Create your account" : "Welcome back";
  formSubtitle.textContent = signup
    ? "Sign up to start managing your clothing store."
    : "Log in to manage your clothing store.";
  submitBtn.textContent = signup ? "Create account" : "Log in";
  confirmWrap.classList.toggle("hidden", !signup);
  confirmPassword.required = signup;
  forgotBtn.classList.toggle("hidden", signup);
  switchPrompt.textContent = signup
    ? "Already have an account?"
    : "New to ThreadStock?";
  switchLink.textContent = signup ? "Log in" : "Create an account";

  clearNotice();
}

loginTab.addEventListener("click", () => setMode("login"));
signupTab.addEventListener("click", () => setMode("signup"));
switchLink.addEventListener("click", () =>
  setMode(mode === "login" ? "signup" : "login")
);

onAuthStateChanged(auth, user => {
  if (user) {
    showNotice(
      `Signed in as ${user.email || "Google user"}. Authentication is working.`,
      "success"
    );
  }
});

authForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearNotice();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    if (mode === "signup") {
      if (password !== confirmPassword.value) {
        showNotice("The passwords do not match.");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      showNotice("Account created successfully. You are now signed in.", "success");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      showNotice("Login successful.", "success");
    }
  } catch (error) {
    showNotice(friendlyError(error.code));
  }
});

googleBtn.addEventListener("click", async () => {
  clearNotice();

  try {
    await signInWithPopup(auth, googleProvider);
    showNotice("Google sign-in successful.", "success");
  } catch (error) {
    showNotice(friendlyError(error.code));
  }
});

forgotBtn.addEventListener("click", async () => {
  clearNotice();

  const email = document.getElementById("email").value.trim();

  if (!email) {
    showNotice("Enter your email address first, then click Forgot password?");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showNotice("Password reset email sent. Check your inbox.", "success");
  } catch (error) {
    showNotice(friendlyError(error.code));
  }
});

function friendlyError(code) {
  const messages = {
    "auth/email-already-in-use": "An account with this email already exists. Please log in.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Use a password with at least 6 characters.",
    "auth/user-not-found": "No account found. Please sign up first.",
    "auth/wrong-password": "Incorrect password. Try again.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
    "auth/unauthorized-domain": "Add your website domain under Firebase Authentication settings → Authorized domains.",
    "auth/operation-not-allowed": "Enable this sign-in method in Firebase Authentication settings."
  };

  return messages[code] ||
    `Authentication failed (${code || "unknown error"}). Please try again.`;
}
