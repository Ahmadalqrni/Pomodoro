// Glass-style toast notifications matching the site's frosted-glass look.
// Usage: showGlassAlert("message", "error" | "success" | "warning" | "info")

(function () {
  if (window.showGlassAlert) return;

  const TYPE_STYLES = {
    info: { icon: "🍅", border: "rgba(255, 200, 100, 0.35)" },
    success: { icon: "✅", border: "rgba(120, 230, 150, 0.4)" },
    warning: { icon: "⚠️", border: "rgba(255, 180, 80, 0.45)" },
    error: { icon: "⛔", border: "rgba(255, 110, 110, 0.45)" },
  };

  function injectStyles() {
    if (document.getElementById("glass-alert-styles")) return;
    const style = document.createElement("style");
    style.id = "glass-alert-styles";
    style.textContent = `
#glass-alert-container {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  pointer-events: none;
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.glass-alert {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 420px;
  width: max-content;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid var(--glass-alert-border, rgba(255, 200, 100, 0.35));
  border-radius: 16px;
  padding: 14px 18px;
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 14.5px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  opacity: 0;
  transform: translateY(-16px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.glass-alert.glass-alert-show {
  opacity: 1;
  transform: translateY(0);
}

.glass-alert-icon {
  font-size: 17px;
  flex-shrink: 0;
}

.glass-alert-message {
  flex: 1;
  line-height: 1.4;
}

.glass-alert-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  cursor: pointer;
  padding: 0 0 0 4px;
  line-height: 1;
  flex-shrink: 0;
  transition: color 0.2s;
}

.glass-alert-close:hover {
  color: white;
}

@media (max-width: 600px) {
  .glass-alert {
    max-width: 100%;
    width: 100%;
  }
}
`;
    document.head.appendChild(style);
  }

  function getContainer() {
    let container = document.getElementById("glass-alert-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "glass-alert-container";
      document.body.appendChild(container);
    }
    return container;
  }

  function showGlassAlert(message, type = "info", duration = 4000) {
    injectStyles();
    const container = getContainer();
    const { icon, border } = TYPE_STYLES[type] || TYPE_STYLES.info;

    const toast = document.createElement("div");
    toast.className = "glass-alert";
    toast.style.setProperty("--glass-alert-border", border);

    const iconEl = document.createElement("span");
    iconEl.className = "glass-alert-icon";
    iconEl.textContent = icon;

    const messageEl = document.createElement("span");
    messageEl.className = "glass-alert-message";
    messageEl.textContent = message;

    const closeBtn = document.createElement("button");
    closeBtn.className = "glass-alert-close";
    closeBtn.textContent = "✕";
    closeBtn.setAttribute("aria-label", "Dismiss");

    toast.appendChild(iconEl);
    toast.appendChild(messageEl);
    toast.appendChild(closeBtn);
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("glass-alert-show"));

    let dismissed = false;
    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      toast.classList.remove("glass-alert-show");
      toast.addEventListener(
        "transitionend",
        () => toast.remove(),
        { once: true }
      );
      setTimeout(() => toast.remove(), 400);
    }

    closeBtn.addEventListener("click", dismiss);
    setTimeout(dismiss, duration);
  }

  window.showGlassAlert = showGlassAlert;
})();
