document.addEventListener("DOMContentLoaded", () => {
  const countdownElement = document.getElementById("countdown");
  const overlay = document.getElementById("overlay-closed");

  const forceOpen = false;

  const closedPeriods = [
    {
      name: "Spring Break",
      start: new Date("March 15, 2026 00:00:00"),
      end: new Date("March 22, 2026 00:00:00"),
    },
    {
      name: "Summer Break",
      start: new Date("May 28, 2026 23:59:59"),
      end: new Date("July 1, 2026 00:00:00"),
    },
    {
      name: "Winter Break",
      start: new Date("December 20, 2026 00:00:00"),
      end: new Date("January 5, 2027 00:00:00"),
    },
  ];

  function blockInteraction() {
    if (!overlay) return;
    document.body.style.overflow = "hidden";
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
  }

  function allowInteraction() {
    if (!overlay) return;
    document.body.style.overflow = "auto";
    overlay.classList.add("hidden");
    overlay.style.display = "none";
  }

  function getCurrentClosedPeriod() {
    if (forceOpen) return null;
    const now = new Date();
    return closedPeriods.find(
      (period) => now >= period.start && now <= period.end,
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

  function formatTime(ms) {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  function updateCountdown() {
    if (!countdownElement) return;

    const now = new Date();

    if (forceOpen) {
      allowInteraction();
      countdownElement.textContent = "Commissions are open (Forced Open).";
      return;
    }

    const currentClosed = getCurrentClosedPeriod();

    if (currentClosed) {
      const distance = currentClosed.end.getTime() - now.getTime();

      if (distance <= 0) {
        allowInteraction();
        countdownElement.textContent = "Commissions are now open!";
      } else {
        blockInteraction();
        const time = formatTime(distance);
        countdownElement.textContent = `Closed for ${currentClosed.name}.`;

        const overlayContent = overlay.querySelector(".overlay-content");
        if (overlayContent) {
          overlayContent.innerHTML = `
            <h3>❌ Commissions Closed</h3>
            <p>Reason: <strong>${currentClosed.name}</strong></p>
            <p>🔓 Reopens in: <strong>${time}</strong></p>
          `;
        }
      }
    } else {
      allowInteraction();
      const nextClosed = getNextClosedPeriod();

      if (nextClosed) {
        const distance = nextClosed.start.getTime() - now.getTime();
        const time = formatTime(distance);
        countdownElement.textContent = `Next closure (${nextClosed.name}) in: ${time}`;
      } else {
        countdownElement.textContent = "Commissions are open.";
      }
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  const blockerObserver = new MutationObserver(() => {
    const currentClosed = getCurrentClosedPeriod();
    if (currentClosed && overlay && !document.body.contains(overlay)) {
      document.body.appendChild(overlay);
    }
  });

  blockerObserver.observe(document.body, { childList: true, subtree: true });
});
