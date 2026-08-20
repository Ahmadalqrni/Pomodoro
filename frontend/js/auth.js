import { login, signup, logout, getPoints } from "../js/api.js";

const authHeading = document.querySelector("#contactbox h1");
const authMessage = document.querySelector("#contactbox p");
const usernameInput = document.querySelector("#UsernameInput");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const loginBtn = document.querySelector("#loginbtn");
const signupBtn = document.querySelector("#signupbtn");

let isSignupMode = false;

// checking if was true or false
function updateAuthMode() {
  if (isSignupMode) {
    authHeading.textContent = "👤 signup";
    authMessage.textContent = "Create your account";
    usernameInput.style.display = "block";
    loginBtn.textContent = "Sign up";
    signupBtn.textContent = "Back to login";
  } else {
    authHeading.textContent = "👤 login";
    authMessage.textContent = "Welcome Back";
    usernameInput.style.display = "none";
    loginBtn.textContent = "Login";
    signupBtn.textContent = "Create new Account";
  }
}

//  change it from ture to false
signupBtn.addEventListener("click", () => {
  isSignupMode = !isSignupMode;
  updateAuthMode();
});

// click enter when user click enter going to trigger loginbtn
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    loginBtn.click();
  }
});

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const username = usernameInput.value.trim();

  if (!email || !password || (isSignupMode && !username)) {
    showGlassAlert("Please enter all required fields.", "warning");
    return;
  }
  try {
    const result = isSignupMode
      ? await signup(username, email, password)
      : await login(email, password);

    // handle success responses from backend
    if (result && result.status === "success") {
      if (isSignupMode) {
        authHeading.textContent = "✅ Signup successful";
        authMessage.textContent = `Welcome, ${
          result.data && result.data.user && result.data.user.name
            ? result.data.user.name
            : username
        }`;
      } else {
        authHeading.textContent = "✅ Logged in";
        authMessage.textContent = `Welcome back, ${
          result.data && result.data.user && result.data.user.name
            ? result.data.user.name
            : ""
        }`;
      }

      // redirect to timer after a short delay
      // set quick local login flag so header updates immediately
      try {
        localStorage.setItem("pomodoroIsLoggedIn", "1");
      } catch (e) {}

      // try fetching points to populate UI before redirect
      (async () => {
        try {
          const p = await getPoints();
          if (p && p.points !== undefined) {
            try {
              localStorage.setItem("pomodoroPoints", String(p.points));
            } catch (e) {}
          }
        } catch (e) {
          // ignore
        }
      })();

      setTimeout(() => {
        window.location.href = "timer.html";
      }, 900);
    } else {
      // backend may return { message: '...' } on error
      throw new Error((result && result.message) || "Authentication failed");
    }
  } catch (error) {
    showGlassAlert(error.message || "Something went wrong", "error");
  }
});

updateAuthMode();
