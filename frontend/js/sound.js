// 🍅 standalone ambient-sound popover (🎵): its own box, separate from
// ⚙️ settings. Relies on loadSettings()/saveSettings() from setting.js,
// which must load first (same "settings" object holds theme/timer/sound).
const SOUND_DEFAULTS = {
  soundOcean: 70,
  soundRain: 70,
};

const openSounds = document.getElementById("openSounds");
const soundPanel = document.getElementById("soundPanel");

openSounds.addEventListener("click", (e) => {
  e.stopPropagation();
  soundPanel.classList.toggle("hidden");
});

// 🍅 clicking outside the popover closes it, but not a click on the button
// that opened it (that toggle is handled above)
document.addEventListener("click", (e) => {
  if (
    !soundPanel.classList.contains("hidden") &&
    !soundPanel.contains(e.target) &&
    e.target !== openSounds
  ) {
    soundPanel.classList.add("hidden");
  }
});

// 🍅 ambient sound buttons (🌊 ocean / 🌧️ rain): click to loop-play, click
// again to stop; each button controls its own <audio>, independent of others.
// A per-sound volume slider sits under each emoji so the level can be tuned
// without touching the system/device volume.
document.querySelectorAll(".sound-btn").forEach((btn) => {
  const audio = new Audio(btn.dataset.audio);
  audio.loop = true;

  const volumeSlider = btn.parentElement.querySelector(".sound-volume");
  const savedVolume = loadSettings().sound?.[btn.id] ?? SOUND_DEFAULTS[btn.id];
  volumeSlider.value = savedVolume;
  audio.volume = savedVolume / 100;

  volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value / 100;

    const settings = loadSettings();
    if (!settings.sound) settings.sound = { ...SOUND_DEFAULTS };
    settings.sound[btn.id] = Number(volumeSlider.value);
    saveSettings(settings);
  });

  btn.addEventListener("click", () => {
    if (btn.classList.contains("playing")) {
      audio.pause();
      audio.currentTime = 0;
      btn.classList.remove("playing");
    } else {
      audio.play();
      btn.classList.add("playing");
    }
  });
});
