import { getPoints, logout } from "./api.js";

async function initAuthLinks() {
  const loginBox = document.getElementById("login_box");
  if (!loginBox) return;
  const ul = loginBox.querySelector("ul");
  if (!ul) return;

  // quick local flag (set after login) to immediately show logout
  let isLoggedIn = false;
  try {
    isLoggedIn = !!localStorage.getItem("pomodoroIsLoggedIn");
  } catch (e) {}

  // validate with backend in background; if backend indicates logged out, we'll fall back to local flag
  (async () => {
    try {
      const res = await getPoints();
      if (res && res.points !== undefined) {
        // backend confirms session; ensure local flag set
        try {
          localStorage.setItem("pomodoroIsLoggedIn", "1");
        } catch (e) {}
        isLoggedIn = true;
        // update UI if not already updated
        if (document.getElementById("logoutLink") == null) {
          ul.innerHTML = `<li><a href="#" id="logoutLink">🔓Logout</a></li>`;
          attachLogout();
        }
      }
    } catch (e) {
      // ignore; keep local flag
    }
  })();

  function attachLogout() {
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          await logout();
        } catch (err) {}
        try {
          localStorage.removeItem("pomodoroPoints");
          localStorage.removeItem("pomodoroIsLoggedIn");
        } catch (e) {}
        window.location.href = "index.html";
      });
    }
  }

  if (isLoggedIn) {
    ul.innerHTML = `<li><a href="#" id="logoutLink">🔓Logout</a></li>`;
    attachLogout();
  } else {
    ul.innerHTML = `\n      <li><a href="auth.html">💻Login</a></li>\n      <li><a href="auth.html">⭐Signup</a></li>\n    `;
  }
}

initAuthLinks();
