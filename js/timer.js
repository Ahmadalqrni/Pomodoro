const timerdisplay = document.getElementById("timerdisplay");
const startbtn = document.getElementById("startbtn");
const resetbtn = document.getElementById("resetbtn");
const titlesession = document.getElementById("titlesession");
const starcount = document.getElementById("starcount");
const sessionfocus = document.getElementById("sessionfocus");
const sessionShort = document.getElementById("sessionshort");
const sessionlong = document.getElementById("sessionlong");

let count = 0;
let timeLeft = 1500;
let timeRunning = false;
let timer = null;
let session = "focus";

//start button
startbtn.addEventListener("click", () => {
  if (timeRunning) return;
  timeRunning = true;
  timer = setInterval(() => {
    if (timeLeft === 0) {
      clearInterval(timer);
      timeRunning = false;
      if (session === "focus") {
        count++;
        starcount.textContent += "⭐";
        if (count === 4) {
          session = "long";
          count = 0;
          starcount.textContent = "⭐";
        } else {
          session = "short";
          playSound();
        }
      } else {
        session = "focus";
      }
      switchSession(session);
      return;
    }
    timeLeft--;
    // time math this create minutes and second
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timerdisplay.textContent = `${minutes}:${seconds}`;
  }, 1000);
});

// Rest button
resetbtn.addEventListener("click", () => {
  session = "focus";
  timeLeft = 1500;
  timerdisplay.textContent = "25:00";
  timeRunning = false;
  switchSession(session, false);
  clearInterval(timer);
  document.querySelectorAll("#sesstion button").forEach((btn) => {
    btn.classList.remove("active");
  });
  sessionfocus.classList.add("active");
});
//----
function switchSession(session, autoStart = true) {
  const sessions = {
    focus: {
      time: 1500,
      title: "Focus Time 🍅",
      timedisplay: "25:00",
      video: "vid/focus.mp4",
    },
    short: {
      time: 300,
      title: "Break Time ☕",
      timedisplay: "5:00",
      video: "vid/break.mp4",
    },
    long: {
      time: 900,
      title: "Long Break 😴",
      timedisplay: "15:00",
      video: "vid/longbreak.mp4",
    },
  };

  timeLeft = sessions[session].time;
  titlesession.textContent = sessions[session].title;
  timerdisplay.textContent = sessions[session].timedisplay;
  const bgvideo = document.querySelector("video");
  bgvideo.style.opacity = 0;
  setTimeout(() => {
    bgvideo.src = sessions[session].video;
    bgvideo.style.opacity = 1;
  }, 500);
  if (autoStart) {
    startbtn.click();
  }
}

// sound api from browser
function playSound() {
  const audioCtx = new AudioContext();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.frequency.value = 830;
  oscillator.type = "sine";
  gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.3);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.5);
}

// on click button of sesstion take u to sesstion u pick
sessionfocus.classList.add("active");

document.querySelectorAll("#sesstion button").forEach((button) => {
  button.addEventListener("click", () => {
    clearInterval(timer);
    timeRunning = false;
    document.querySelectorAll("#sesstion button").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    session = button.id.replace("session", "").toLowerCase();
    switchSession(session, false);
  });
});
