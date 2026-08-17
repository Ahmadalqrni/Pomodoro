const overlay = document.getElementById("overlay");
const openSettings = document.getElementById("openSettings");
const closeSettings = document.getElementById("closeSettings");
const swatches = document.querySelectorAll(".swatch");

openSettings.addEventListener("click", () =>
  overlay.classList.remove("hidden"),
);
closeSettings.addEventListener("click", () => overlay.classList.add("hidden"));

const DEFAULTS = {
  theme: {
    accentRgb: "255, 115, 0",
  },
  timer: {
    focus: 25,
    short: 5,
    long: 15,
  },
};
function saveSettings(settings) {
  localStorage.setItem("settings", JSON.stringify(settings));
}
function loadSettings() {
  const saved = localStorage.getItem("settings");
  if (saved === null) {
    return DEFAULTS;
  }
  return JSON.parse(saved);
}

function applyAccent(accentRgb) {
  document.documentElement.style.setProperty("--accent-rgb", accentRgb);
  swatches.forEach((swatch) =>
    swatch.classList.toggle("selected", swatch.dataset.color === accentRgb),
  );
}

swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    const settings = loadSettings();
    settings.theme.accentRgb = swatch.dataset.color;
    saveSettings(settings);
    applyAccent(swatch.dataset.color);
  });
});

applyAccent(loadSettings().theme.accentRgb);
