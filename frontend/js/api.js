const API =
  window.location.hostname === "localhost" ? "http://localhost:5001" : "/api"; // auth

async function fetchWithRefresh(url, options = {}) {
  const response = await fetch(url, options);
  if (response.status !== 401) return response;

  const refreshResponse = await fetch(`${API}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });
  if (!refreshResponse.ok) return response;

  return fetch(url, options);
}

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
  const res = await fetchWithRefresh(`${API}/point/visit`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}

async function getPoints() {
  const res = await fetchWithRefresh(`${API}/point/show`, {
    credentials: "include",
  });
  return res.json();
}

export { signup, login, logout, addpoint, getPoints };
