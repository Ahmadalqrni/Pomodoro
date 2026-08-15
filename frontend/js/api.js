const API =
  window.location.hostname === "localhost"
    ? "http://localhost:5001"
    : "https://pomodoro-f8a3.onrender.com";
// auth
async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

async function signup(name, email, password) {
  const res = await fetch(`${API}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

async function logout() {
  const res = await fetch(`${API}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

// point
async function addpoint() {
  const res = await fetch(`${API}/point/visit`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

async function getPoints() {
  const res = await fetch(`${API}/point/show`, {
    credentials: "include",
  });
  return res.json();
}

export { signup, login, logout, addpoint, getPoints };
