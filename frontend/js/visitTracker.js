const trackerBox = document.createElement("div");
trackerBox.id = "visit-tracker";
trackerBox.innerHTML = `
  <div class="tracker-title">Visit Tracker</div>
  <div class="tracker-content">
    <div><strong>Days visited:</strong> <span id="visitDaysValue">0</span></div>
  </div>
`;
document.body.appendChild(trackerBox);

async function updateTracker(userId) {
  if (!userId) return;

  try {
    const response = await fetch(`/api/user/${userId}`);
    if (!response.ok) return;
    const data = await response.json();
    document.querySelector("#visitDaysValue").textContent = data.visitDays;
  } catch (error) {
    console.error("Tracker load failed", error);
  }
}

const savedUserId = localStorage.getItem("pomodoroUserId");
if (savedUserId) {
  updateTracker(savedUserId);
}
