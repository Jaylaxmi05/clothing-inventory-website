/*
  ThreadStock authentication using Firebase Authentication.
  Setup is required before real login works:
  1. Create a Firebase project at https://console.firebase.google.com/
  2. Add a Web app and copy its firebaseConfig into the object below.
  3. Firebase Console > Authentication > Sign-in method: enable Email/Password and Google.
  4. Authentication > Settings > Authorized domains: add your GitHub Pages domain.
  Do not collect a user's Google account password. Google sign-in uses Google's secure popup.
*/
const firebaseConfig = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  appId: "PASTE_YOUR_FIREBASE_APP_ID"
};

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
let auth = null;
let configured = false;

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
  formSubtitle.textContent = signup ? "Sign up to start managing your clothing store." : "Log in to manage your clothing store.";
  submitBtn.textContent = signup ? "Create account" : "Log in";
  confirmWrap.classList.toggle("hidden", !signup);
  confirmPassword.required = signup;
  forgotBtn.classList.toggle("hidden", signup);
  switchPrompt.textContent = signup ? "Already have an account?" : "New to ThreadStock?";
  switchLink.textContent = signup ? "Log in" : "Create an account";
  clearNotice();
}
loginTab.addEventListener("click", () => setMode("login"));
signupTab.addEventListener("click", () => setMode("signup"));
switchLink.addEventListener("click", () => setMode(mode === "login" ? "signup" : "login"));

try {
  const placeholdersPresent = Object.values(firebaseConfig).some(v => String(v).startsWith("PASTE_"));
  if (!placeholdersPresent && window.firebase) {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    configured = true;
    auth.onAuthStateChanged(user => {
      if (user) showNotice(`Signed in as ${user.email || "Google user"}. Authentication is working.`, "success");
    });
  }
} catch (e) {
  console.error(e);
}

authForm.addEventListener("submit", async event => {
  event.preventDefault();
  clearNotice();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  if (!configured) {
    showNotice("Firebase setup is not complete yet. Follow README.txt to connect Firebase Authentication. The page design is ready, but real account login cannot work until setup is completed.");
    return;
  }
  try {
    if (mode === "signup") {
      if (password !== confirmPassword.value) {
        showNotice("The passwords do not match.");
        return;
      }
      await auth.createUserWithEmailAndPassword(email, password);
      showNotice("Account created successfully. You are now signed in.", "success");
    } else {
      await auth.signInWithEmailAndPassword(email, password);
      showNotice("Login successful.", "success");
    }
  } catch (error) {
    showNotice(friendlyError(error.code));
  }
});

googleBtn.addEventListener("click", async () => {
  clearNotice();
  if (!configured) {
    showNotice("Google sign-in needs Firebase setup first. Follow README.txt to connect your Firebase project.");
    return;
  }
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
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
  if (!configured) {
    showNotice("Password reset needs Firebase setup first. Follow README.txt.");
    return;
  }
  try {
    await auth.sendPasswordResetEmail(email);
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
    "auth/user-not-found": "No account found for this email. Please sign up first.",
    "auth/wrong-password": "Incorrect password. Try again or reset your password.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/popup-closed-by-user": "Google sign-in was closed before finishing.",
    "auth/unauthorized-domain": "This website domain is not authorized in Firebase Authentication settings."
  };
  return messages[code] || `Could not complete authentication (${code || "unknown error"}). Check your Firebase setup and try again.`;
}
