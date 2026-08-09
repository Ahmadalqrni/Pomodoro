const authHeading = document.querySelector("#contactbox h1");
const authMessage = document.querySelector("#contactbox p");
const usernameInput = document.querySelector("#UsernameInput");
const emailInput = document.querySelector("#emailInput");
const passwordInput = document.querySelector("#passwordInput");
const loginBtn = document.querySelector("#loginbtn");
const signupBtn = document.querySelector("#signupbtn");

let isSignupMode = false;

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

signupBtn.addEventListener("click", () => {
  isSignupMode = !isSignupMode;
  updateAuthMode();
});

async function sendAuthRequest(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || response.statusText || "Request failed");
  }
  return data;
}

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const username = usernameInput.value.trim();

  if (!email || !password || (isSignupMode && !username)) {
    alert("Please enter all required fields.");
    return;
  }

  const payload = { email, password };
  if (isSignupMode) {
    payload.username = username;
  }

  const endpoint = isSignupMode ? "/api/signup" : "/api/login";

  try {
    const result = await sendAuthRequest(endpoint, payload);
    console.log("Auth success", result);
    localStorage.setItem("pomodoroUserId", result.id);
    alert(
      `Welcome ${result.username}! Your visit count is ${result.visitDays}.`,
    );
    window.location.href = "index.html";
  } catch (error) {
    console.error("Auth error", error);
    alert(error.message || "Unable to connect to the auth server.");
  }
});

updateAuthMode();
