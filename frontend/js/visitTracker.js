import { getPoints } from "./api.js";

const trackerBox = document.createElement("div");
trackerBox.id = "visit-tracker";
trackerBox.innerHTML = `
  <div class="tracker-content-small">
    <span id="pointsEmoji">🍅</span>
    <span id="pointsValue">0</span>
    <span class="points-label">points</span>
  </div>
`;
document.body.appendChild(trackerBox);

function updatePointsLocal(value) {
  const val = typeof value === "number" ? value : Number(value) || 0;
  const el = document.getElementById("pointsValue");
  if (el) el.textContent = val;
  try {
    localStorage.setItem("pomodoroPoints", String(val));
  } catch (e) {}
}

// reuse global updater if exists
if (!window.updatePoints) window.updatePoints = updatePointsLocal;

// initialize: try fetching from backend (if logged in), else fall back to localStorage
// Try to fetch points with a few retries to handle cookie timing after login
async function tryFetchPoints(retries = 4, delayMs = 400) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await getPoints();
      if (res && res.points !== undefined) return res.points;
    } catch (e) {
      // continue to retry
    }
    if (i < retries) await new Promise((r) => setTimeout(r, delayMs));
  }
  return null;
}

(async function initPoints() {
  const pts = await tryFetchPoints();
  if (pts !== null) {
    updatePointsLocal(pts);
    return;
  }

  const savedPoints = localStorage.getItem("pomodoroPoints");
  if (savedPoints) updatePointsLocal(Number(savedPoints));
})();
