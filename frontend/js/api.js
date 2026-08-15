//auth
async function login(email, password) {
  const res = await fetch("https://pomodoro-f8a3.onrender.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
async function signup(name, email, password) {
  const res = await fetch("https://pomodoro-f8a3.onrender.com/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
async function logout() {
  const res = await fetch("https://pomodoro-f8a3.onrender.com/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return res.json();
}

// point

async function addpoint() {
  const res = await fetch("https://pomodoro-f8a3.onrender.com/point/visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
}

async function getPoints() {
  const res = await fetch("https://pomodoro-f8a3.onrender.com/point", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
}

export { signup, login, logout, addpoint, getPoints };
