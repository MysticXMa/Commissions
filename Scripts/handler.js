document.addEventListener("DOMContentLoaded", () => {
  const baseSelect = document.getElementById("style");
  const customBaseWrapper = document.getElementById("custom-base-wrapper");
  const countdownElement = document.getElementById("countdown");
  const overlay = document.getElementById("overlay-closed");

  const forceOpen = true;

  const closedPeriods = [
    {
      name: "Summer Break",
      start: new Date("May 28, 2025 23:59:59"),
      end: new Date("July 31, 2025 00:00:00"),
    },
    {
      name: "Winter Break",
      start: new Date("December 20, 2025 00:00:00"),
      end: new Date("January 5, 2026 00:00:00"),
    },
    {
      name: "Spring Break",
      start: new Date("March 15, 2025 00:00:00"),
      end: new Date("March 22, 2025 00:00:00"),
    },
  ];

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

  function getCurrentClosedPeriod() {
    if (forceOpen) return null;
    const now = new Date();
    return closedPeriods.find(
      (period) => now >= period.start && now <= period.end
    );
  }

  function getNextClosedPeriod() {
    if (forceOpen) return null;
    const now = new Date();
    const upcoming = closedPeriods
      .filter((period) => period.start > now)
      .sort((a, b) => a.start - b.start);
    return upcoming.length ? upcoming[0] : null;
  }

  function updateCountdown() {
    if (forceOpen) {
      allowInteraction();
      countdownElement.textContent = "Commissions are open (Forced Open Mode).";
      overlay.querySelector(".overlay-content").innerHTML = "";
      return;
    }

    const now = new Date();

    const currentClosed = getCurrentClosedPeriod();

    if (currentClosed) {
      const distance = currentClosed.end.getTime() - now.getTime();

      if (distance <= 0) {
        countdownElement.textContent = "Commissions are now open!";
        allowInteraction();
      } else {
        blockInteraction();

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.textContent = `Closed for ${currentClosed.name}. Reopens in: ${days}d ${hours}h ${minutes}m ${seconds}s`;

        overlay.querySelector(
          ".overlay-content"
        ).innerHTML = `❌ <strong>Commissions Closed for ${currentClosed.name}</strong><br><br>🔓 Reopens in: <strong>${days}d ${hours}h ${minutes}m ${seconds}s</strong>`;
      }
    } else {
      allowInteraction();

      const nextClosed = getNextClosedPeriod();

      if (nextClosed) {
        const distance = nextClosed.start.getTime() - now.getTime();

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          countdownElement.textContent = `Open now. Next closure (${nextClosed.name}) starts in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
          overlay.querySelector(".overlay-content").innerHTML = "";
        } else {
          countdownElement.textContent = "Open now.";
          overlay.querySelector(".overlay-content").innerHTML = "";
        }
      } else {
        countdownElement.textContent = "Commissions are open.";
        overlay.querySelector(".overlay-content").innerHTML = "";
      }
    }
  }

  setInterval(() => {
    updateCountdown();
  }, 1000);

  updateCountdown();

  window.addEventListener("popstate", () => {
    const currentClosed = getCurrentClosedPeriod();
    if (currentClosed) {
      history.pushState(null, "", window.location.href);
    }
  });

  window.addEventListener("beforeunload", (e) => {
    const currentClosed = getCurrentClosedPeriod();
    if (currentClosed) {
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
