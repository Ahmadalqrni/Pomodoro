//auth
async function login(email, password) {
  const res = await fetch("http://localhost:5001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
async function signup(name, email, password) {
  const res = await fetch("http://localhost:5001/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
async function logout() {
  const res = await fetch("http://localhost:5001/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return res.json();
}

// point

async function addpoint() {
  const res = await fetch("http://localhost:5001/point/visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
}

async function getPoints() {
  const res = await fetch("http://localhost:5001/point", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.json();
}

export { signup, login, logout, addpoint, getPoints };
