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
// 🍅 timer length inputs (focus / short break / long break)
const focusInput = document.getElementById("focusInput");
const shortInput = document.getElementById("shortInput");
const longInput = document.getElementById("longInput");

const timerInputs = {
  focus: focusInput,
  short: shortInput,
  long: longInput,
};

// 🍅 prefill inputs with saved values instead of the hardcoded HTML defaults
const savedSettings = loadSettings();
Object.entries(timerInputs).forEach(([key, input]) => {
  input.value = savedSettings.timer[key];
});

// 🍅 clamps an input to its min/max and saves it under settings.timer[key]
function applyTimerInput(key, input) {
  const min = Number(input.min);
  const max = Number(input.max);
  let value = Number(input.value);

  if (!Number.isFinite(value) || value < min) value = min;
  if (value > max) value = max;
  input.value = value;

  const settings = loadSettings();
  settings.timer[key] = value;
  saveSettings(settings);
}

// 🍅 wire up all three inputs, not just focus
Object.entries(timerInputs).forEach(([key, input]) => {
  input.addEventListener("change", () => applyTimerInput(key, input));
});

// 🍅 +/- steppers replacing the native number-input spin arrows
document.querySelectorAll(".step-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const step = btn.classList.contains("plus") ? 1 : -1;
    input.value = Number(input.value) + step;
    input.dispatchEvent(new Event("change"));
  });
});

// 🍅 Apply Time button: saves whatever is in the inputs right now and tells
// timer.js to refresh the on-screen time immediately, no page refresh needed
const applySettingsBtn = document.getElementById("applySettings");
applySettingsBtn.addEventListener("click", () => {
  Object.entries(timerInputs).forEach(([key, input]) =>
    applyTimerInput(key, input),
  );
  window.dispatchEvent(new CustomEvent("timerSettingsChanged"));
});

applyAccent(loadSettings().theme.accentRgb);
