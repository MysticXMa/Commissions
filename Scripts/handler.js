document.addEventListener("DOMContentLoaded", () => {
  const baseSelect = document.getElementById("style");
  const customBaseWrapper = document.getElementById("custom-base-wrapper");
  const countdownElement = document.getElementById("countdown");
  const overlay = document.getElementById("overlay-closed");
  const closeDate = new Date("May 28, 2025 23:59:59");
  const reopenDate = new Date("May 1, 2025 00:00:00");

  function handleAvatarBaseChange() {
    if (baseSelect.value === "Other") {
      customBaseWrapper.classList.remove("hidden");
    } else {
      customBaseWrapper.classList.add("hidden");
      document.getElementById("custom-base").value = "";
    }
  }

  baseSelect.addEventListener("change", handleAvatarBaseChange);

  function blockInteraction() {
    document.body.style.pointerEvents = "none";
    overlay.classList.remove("hidden");
    overlay.style.pointerEvents = "auto";
  }

  function allowInteraction() {
    document.body.style.pointerEvents = "auto";
    overlay.classList.add("hidden");
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = closeDate.getTime() - now;

    if (distance <= 0) {
      countdownElement.textContent = "Commissions are now closed.";
      blockInteraction();
      updateOverlayTimer();
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  }

  function updateOverlayTimer() {
    const now = new Date().getTime();
    const distance = reopenDate.getTime() - now;

    if (distance <= 0) {
      overlay.querySelector(".overlay-content").innerHTML =
        "✅ <strong>Commissions are now open!</strong>";
      allowInteraction();
    } else {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      overlay.querySelector(
        ".overlay-content"
      ).innerHTML = `❌ <strong>Commissions Closed for Summer</strong><br><br>🔓 Reopens in: <strong>${days}d ${hours}h ${minutes}m ${seconds}s</strong>`;
    }
  }

  setInterval(() => {
    updateCountdown();
    if (new Date().getTime() > closeDate.getTime()) {
      updateOverlayTimer();
    }
  }, 1000);

  updateCountdown();

  window.addEventListener("popstate", () => {
    if (new Date().getTime() > closeDate.getTime()) {
      history.pushState(null, "", window.location.href);
    }
  });

  window.addEventListener("beforeunload", (e) => {
    if (new Date().getTime() > closeDate.getTime()) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  const blockerObserver = new MutationObserver(() => {
    if (!document.body.contains(overlay)) {
      document.body.appendChild(overlay);
      blockInteraction();
    }
  });

  blockerObserver.observe(document.body, { childList: true, subtree: true });

  handleAvatarBaseChange();
});

function generateRandomBuild() {
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `v1.0.1-beta.3+build${random}`;
}

document.getElementById("versionDisplay").textContent = generateRandomBuild();
