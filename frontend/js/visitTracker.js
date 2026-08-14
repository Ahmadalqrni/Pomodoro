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

// initialize from localStorage
const savedPoints = localStorage.getItem("pomodoroPoints");
if (savedPoints) updatePointsLocal(Number(savedPoints));
