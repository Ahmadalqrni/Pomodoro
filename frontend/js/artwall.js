const STORAGE_KEY = "artWall";
const SIZES = [8, 16, 24, 32];
const CANVAS_PX = 512;
// when download is going to change it to 24x24 so even small image going to look good
const EXPORT_SCALE = 24;

const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const colorHex = document.getElementById("colorHex");
const paintTool = document.getElementById("paintTool");
const eraseTool = document.getElementById("eraseTool");
const downloadArt = document.getElementById("downloadArt");
const clearArt = document.getElementById("clearArt");
const sizeButtons = document.querySelectorAll(".size-btn");

// this to say to notbook
function emptyGrid(size) {
  // null at the is better then use holse
  return Array(size * size).fill(null);
}

function defaultState() {
  return {
    size: 16,
    color: "#ff7300",
    tool: "paint",
    grids: {
      8: emptyGrid(8),
      16: emptyGrid(16),
      24: emptyGrid(24),
      32: emptyGrid(32),
    },
  };
}

function loadArt() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return defaultState();
  try {
    const parsed = JSON.parse(saved);
    const base = defaultState();
    const size = SIZES.includes(parsed.size) ? parsed.size : 16;
    const color =
      typeof parsed.color === "string" && /^#[0-9a-fA-F]{6}$/.test(parsed.color)
        ? parsed.color.toLowerCase()
        : "#ff7300";
    SIZES.forEach((n) => {
      const grid = parsed.grids && parsed.grids[n];
      if (Array.isArray(grid) && grid.length === n * n) {
        base.grids[n] = grid;
      }
    });
    return {
      ...base,
      size,
      color,
      tool: parsed.tool === "erase" ? "erase" : "paint",
    };
  } catch {
    return defaultState();
  }
}

function saveArt() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadArt();
let painting = true;

function currentGrid() {
  return state.grids[state.size];
}

function cellFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * state.size;
  const y = ((event.clientY - rect.top) / rect.height) * state.size;
  const col = Math.min(state.size - 1, Math.max(0, Math.floor(x)));
  const row = Math.min(state.size - 1, Math.max(0, Math.floor(y)));
  return row * state.size + col;
}

function paintCell(index) {
  const grid = currentGrid();
  const next = state.tool === "erase" ? null : state.color;
  if (grid[index] === next) return;
  grid[index] = next;
  draw();
  saveArt();
}

function draw() {
  const size = state.size;
  const cell = CANVAS_PX / size;
  const grid = currentGrid();
  ctx.clearRect(0, 0, CANVAS_PX, CANVAS_PX);
  ctx.imageSmoothingEnabled = false;

  for (let i = 0; i < grid.length; i++) {
    const color = grid[i];
    if (!color) continue;
    const col = i % size;
    const row = Math.floor(i / size);
    ctx.fillStyle = color;
    ctx.fillRect(col * cell, row * cell, cell, cell);
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= size; i++) {
    const pos = i * cell;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, CANVAS_PX);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(CANVAS_PX, pos);
    ctx.stroke();
  }
}

function setTool(tool) {
  state.tool = tool;
  paintTool.classList.toggle("active", tool === "paint");
  eraseTool.classList.toggle("active", tool === "erase");
  saveArt();
}

function setSize(size) {
  state.size = size;
  sizeButtons.forEach((btn) =>
    btn.classList.toggle("active", Number(btn.dataset.size) === size),
  );
  draw();
  saveArt();
}

function normalizeHex(value) {
  const hex = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) return hex.toLowerCase();
  if (/^[0-9a-fA-F]{6}$/.test(hex)) return `#${hex.toLowerCase()}`;
  return null;
}

function setColor(hex) {
  state.color = hex;
  colorPicker.value = hex;
  colorHex.value = hex;
  saveArt();
}

sizeButtons.forEach((btn) => {
  btn.addEventListener("click", () => setSize(Number(btn.dataset.size)));
});

colorPicker.addEventListener("input", () => setColor(colorPicker.value));
colorHex.addEventListener("change", () => {
  const hex = normalizeHex(colorHex.value);
  if (!hex) {
    colorHex.value = state.color;
    if (window.showGlassAlert)
      showGlassAlert("Use a hex color like #ff7300", "warning");
    return;
  }
  setColor(hex);
});

paintTool.addEventListener("click", () => setTool("paint"));
eraseTool.addEventListener("click", () => setTool("erase"));

canvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  painting = true;
  paintCell(cellFromEvent(event));
});

canvas.addEventListener("pointermove", (event) => {
  if (!painting) return;
  paintCell(cellFromEvent(event));
});

canvas.addEventListener("pointerup", () => {
  painting = false;
});

canvas.addEventListener("pointercancel", () => {
  painting = false;
});

canvas.addEventListener("pointerleave", () => {
  painting = false;
});

clearArt.addEventListener("click", () => {
  state.grids[state.size] = emptyGrid(state.size);
  draw();
  saveArt();
  if (window.showGlassAlert) showGlassAlert("Canvas cleared", "info");
});

downloadArt.addEventListener("click", () => {
  const size = state.size;
  const grid = currentGrid();
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = size * EXPORT_SCALE;
  exportCanvas.height = size * EXPORT_SCALE;
  const exportCtx = exportCanvas.getContext("2d");
  exportCtx.imageSmoothingEnabled = false;
  exportCtx.fillStyle = "#ffffff";
  exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

  for (let i = 0; i < grid.length; i++) {
    const color = grid[i];
    if (!color) continue;
    const col = i % size;
    const row = Math.floor(i / size);
    exportCtx.fillStyle = color;
    exportCtx.fillRect(
      col * EXPORT_SCALE,
      row * EXPORT_SCALE,
      EXPORT_SCALE,
      EXPORT_SCALE,
    );
  }

  const link = document.createElement("a");
  link.download = `art-wall-${size}x${size}.png`;
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
  if (window.showGlassAlert) showGlassAlert("Art downloaded", "success");
});

setSize(state.size);
setColor(state.color);
setTool(state.tool);
draw();
