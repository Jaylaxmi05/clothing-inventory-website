(() => {
  const $ = id => document.getElementById(id);
  const USERS_KEY = "ts_users";
  const SESSION_KEY = "ts_current_user";
  let mode = "login";

  const readUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      return Array.isArray(users) ? users : [];
    } catch {
      return [];
    }
  };

  function showError(message) {
    $("auth-error").textContent = message;
  }

  function setMode(nextMode) {
    mode = nextMode;
    const signup = mode === "signup";
    $("auth-title").textContent = signup ? "Create your account" : "Login to your account";
    $("auth-subtitle").textContent = signup
      ? "Create an account to manage your clothing store."
      : "Enter your email and password to continue.";
    $("auth-submit").textContent = signup ? "Create account" : "Login";
    $("auth-switch-text").textContent = signup ? "Already have an account?" : "Don't have an account?";
    $("auth-switch").textContent = signup ? "Login" : "Sign up";
    $("name-field").hidden = !signup;
    $("confirm-field").hidden = !signup;
    $("auth-name").required = signup;
    $("auth-confirm").required = signup;
    $("auth-password").autocomplete = signup ? "new-password" : "current-password";
    showError("");
  }

  function enterApp(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      email: user.email,
      name: user.name || ""
    }));
    $("auth-screen").hidden = true;
    $("app-shell").hidden = false;
    $("logged-in-email").textContent = user.email;
  }

  function showLogin() {
    $("app-shell").hidden = true;
    $("auth-screen").hidden = false;
    $("auth-form").reset();
    setMode("login");
  }

  $("auth-switch").addEventListener("click", () => {
    setMode(mode === "login" ? "signup" : "login");
  });

  $("auth-form").addEventListener("submit", event => {
    event.preventDefault();

    const email = $("auth-email").value.trim().toLowerCase();
    const password = $("auth-password").value;
    const users = readUsers();

    if (!email || !password) {
      showError("Please enter your email and password.");
      return;
    }

    if (mode === "signup") {
      const name = $("auth-name").value.trim();
      const confirm = $("auth-confirm").value;

      if (!name) {
        showError("Please enter your name.");
        return;
      }
      if (password.length < 6) {
        showError("Password must contain at least 6 characters.");
        return;
      }
      if (password !== confirm) {
        showError("Passwords do not match.");
        return;
      }
      if (users.some(user => user.email === email)) {
        showError("An account with this email already exists. Please login.");
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      enterApp(newUser);
      return;
    }

    const user = users.find(item => item.email === email && item.password === password);
    if (!user) {
      showError("Invalid email or password. Please try again or sign up.");
      return;
    }
    enterApp(user);
  });

  $("logout").addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    showLogin();
  });

  // Restore the login session when the page is refreshed.
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (session && session.email) {
      const user = readUsers().find(item => item.email === session.email);
      if (user) {
        enterApp(user);
        return;
      }
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    localStorage.removeItem(SESSION_KEY);
  }
  showLogin();
})();
