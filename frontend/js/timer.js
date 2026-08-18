import { addpoint } from "../js/api.js";

const timerdisplay = document.getElementById("timerdisplay");
const startbtn = document.getElementById("startbtn");
const resetbtn = document.getElementById("resetbtn");
const pausebtn = document.getElementById("pausebtn");
const titlesession = document.getElementById("titlesession");
const starcount = document.getElementById("starcount");
const sessionfocus = document.getElementById("sessionfocus");
const sessionShort = document.getElementById("sessionshort");
const sessionlong = document.getElementById("sessionlong");
const ToDoList = document.getElementById("ToDoList");

let count = 0;
// 🍅 timeLeft is now set from saved settings via switchSession(), not hardcoded
let timeLeft;
let timeRunning = false;
let timer = null;
let session = "focus";

//start button
startbtn.addEventListener("click", async () => {
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
          starcount.textContent = "";
          playSound(); // 🍅 long break now plays the sound too
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

  console.log(addpoint);
  try {
    const res = await addpoint();
    if (res && typeof window.updatePoints === "function") {
      // backend returns { message, points }
      if (res.points !== undefined) {
        window.updatePoints(res.points);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

// Rest button
resetbtn.addEventListener("click", () => {
  session = "focus";
  // 🍅 timeLeft/display reset now goes through switchSession() below,
  // so reset respects the user's custom timer lengths
  timeRunning = false;
  switchSession(session, false);
  clearInterval(timer);
  document.querySelectorAll("#sesstion button").forEach((btn) => {
    btn.classList.remove("active");
  });
  sessionfocus.classList.add("active");
});
//----
// pause button

pausebtn.addEventListener("click", () => {
  clearInterval(timer);
  timeRunning = false;
});
// 🍅 formats seconds into m:ss for the settings-driven session lengths below
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" + s : s}`;
}

function switchSession(session, autoStart = true) {
  // 🍅 session lengths now come from user settings instead of hardcoded 1500/300/900
  const s = loadSettings();
  const focusSecs = s.timer.focus * 60;
  const shortSecs = s.timer.short * 60;
  const longSecs = s.timer.long * 60;

  const sessions = {
    focus: {
      time: focusSecs,
      title: "🍅 Focus Time 🍅",
      timedisplay: formatTime(focusSecs),
      video: "vid/focus.mp4",
    },
    short: {
      time: shortSecs,
      title: "☕ Break Time ☕",
      timedisplay: formatTime(shortSecs),
      video: "vid/break.mp4",
    },
    long: {
      time: longSecs,
      title: "😴 Long Break 😴",
      timedisplay: formatTime(longSecs),
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
  document.querySelectorAll("#sesstion button").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById("session" + session).classList.add("active");
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

// do list task savestorage
function loadTasks() {
  const do_list = localStorage.getItem("tasks");
  if (!do_list) return;
  let tasks = JSON.parse(do_list);

  tasks.forEach((task) => {
    const li = document.createElement("li");
    const span = document.createElement("span");

    span.textContent = task.text;

    if (task.checked) {
      span.style.textDecoration = "line-through";
      li.classList.add("checked");
    }

    li.addEventListener("click", () => {
      task.checked = !task.checked;
      span.style.textDecoration = task.checked ? "line-through" : "none";
      li.classList.toggle("checked");
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log(task);
    });

    li.appendChild(span);
    ToDoList.appendChild(li);
  });
}
// 🍅 apply saved timer lengths to the display as soon as the page loads
switchSession("focus", false);
window.addEventListener("storage", () => {
  ToDoList.innerHTML = "";
  loadTasks();
});

// 🍅 "Apply Time" button in settings: refresh the on-screen time right away
// instead of making the user reload the page for the new lengths to show up
window.addEventListener("timerSettingsChanged", () => {
  clearInterval(timer);
  timeRunning = false;
  switchSession(session, false);
});
loadTasks();
