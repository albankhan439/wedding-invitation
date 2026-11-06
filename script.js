const loader = document.getElementById("loader");
const intro = document.getElementById("intro-screen");
const website = document.getElementById("website");
const seal = document.querySelector(".gold-seal");
const form = document.getElementById("rsvpForm");
const popup = document.getElementById("popup");
const closePopupButton = document.getElementById("closePopup");
const navLinks = document.querySelector(".nav-links");
const siteHeader = document.querySelector(".site-header");
const autoScrollControl = document.getElementById("autoScrollControl");
const previewParameters = new URLSearchParams(window.location.search);
const previewSection = previewParameters.get("section");
const gatePreview = previewParameters.get("gate");
const previewMode = previewParameters.has("preview") || Boolean(previewSection);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let autoScrollFrame = null;
let autoScrollResumeTimer = null;
let autoScrollLastTime = null;
let autoScrollPosition = 0;
let autoScrollActive = false;
let autoScrollEnabled = true;
let autoScrollComplete = false;

function updateAutoScrollControl() {
    if (!autoScrollControl) return;

    const icon = autoScrollControl.querySelector(".auto-scroll-icon");
    const label = autoScrollControl.querySelector(".auto-scroll-label");
    autoScrollControl.classList.toggle("is-paused", !autoScrollActive);

    if (autoScrollComplete) {
        if (icon) icon.textContent = "↑";
        if (label) label.textContent = "Back to top";
        autoScrollControl.setAttribute("aria-label", "Return to the top and replay automatic scrolling");
        autoScrollControl.setAttribute("aria-pressed", "false");
        return;
    }

    if (autoScrollActive) {
        if (icon) icon.textContent = "Ⅱ";
        if (label) label.textContent = "Auto scroll";
        autoScrollControl.setAttribute("aria-label", "Pause automatic scrolling");
        autoScrollControl.setAttribute("aria-pressed", "true");
    } else {
        if (icon) icon.textContent = "▶";
        if (label) label.textContent = "Resume scroll";
        autoScrollControl.setAttribute("aria-label", "Resume automatic scrolling");
        autoScrollControl.setAttribute("aria-pressed", "false");
    }
}

function stopAutoScroll() {
    if (autoScrollFrame !== null) {
        window.cancelAnimationFrame(autoScrollFrame);
        autoScrollFrame = null;
    }
    autoScrollLastTime = null;
    autoScrollActive = false;
    updateAutoScrollControl();
}

function autoScrollStep(timestamp) {
    if (!autoScrollActive) return;

    if (autoScrollLastTime === null) autoScrollLastTime = timestamp;
    const elapsed = Math.min(timestamp - autoScrollLastTime, 50);
    const speed = window.innerWidth <= 620 ? 30 : 40;
    autoScrollLastTime = timestamp;
    // Keep fractional pixels between frames and bypass CSS smooth scrolling.
    autoScrollPosition += speed * elapsed / 1000;
    window.scrollTo({ top: autoScrollPosition, behavior: "instant" });

    const reachedBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (reachedBottom) {
        autoScrollComplete = true;
        autoScrollEnabled = false;
        stopAutoScroll();
        return;
    }

    autoScrollFrame = window.requestAnimationFrame(autoScrollStep);
}

function startAutoScroll() {
    if (reducedMotion.matches || !autoScrollEnabled || autoScrollActive || document.hidden || form?.contains(document.activeElement)) return;
    window.clearTimeout(autoScrollResumeTimer);
    autoScrollComplete = false;
    autoScrollActive = true;
    autoScrollLastTime = null;
    autoScrollPosition = window.scrollY;
    updateAutoScrollControl();
    autoScrollFrame = window.requestAnimationFrame(autoScrollStep);
}

function pauseAutoScroll(resumeAfter = 0) {
    const shouldResume = autoScrollEnabled && !autoScrollComplete;
    window.clearTimeout(autoScrollResumeTimer);
    stopAutoScroll();

    if (resumeAfter > 0 && shouldResume) {
        autoScrollResumeTimer = window.setTimeout(startAutoScroll, resumeAfter);
    }
}

function temporarilyPauseAutoScroll() {
    if (autoScrollActive || autoScrollEnabled) pauseAutoScroll(7000);
}

function showWebsite() {
    if (!website) return;
    website.style.display = "block";
    document.querySelectorAll(".hero .reveal").forEach((item) => item.classList.add("is-visible"));
    document.body.classList.remove("intro-active");
    window.scrollTo({ top: 0, behavior: "auto" });

    if (intro) {
        intro.classList.add("is-finished");
        window.setTimeout(() => {
            intro.style.display = "none";
        }, 750);
    }

    window.setTimeout(initRevealAnimations, 50);

    if (!previewMode && !reducedMotion.matches) {
        window.clearTimeout(autoScrollResumeTimer);
        autoScrollResumeTimer = window.setTimeout(startAutoScroll, 3200);
    }

    if (previewMode && previewSection) {
        const scrollToPreviewSection = () => {
            const target = document.getElementById(previewSection);
            if (!target) return;
            target.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
            target.scrollIntoView({ behavior: "instant", block: "start" });
        };
        window.setTimeout(scrollToPreviewSection, 180);
        window.setTimeout(scrollToPreviewSection, 900);
    }
}

function openInvitation() {
    if (!intro || intro.classList.contains("opened")) return;

    intro.classList.add("opened");
    seal?.classList.add("active");
    const tapText = document.querySelector(".tap-text");
    const initialStage = intro.querySelector(".stage-initial");
    const doorStage = intro.querySelector(".stage-door");

    if (tapText) tapText.style.opacity = "0";

    window.setTimeout(() => {
        initialStage?.classList.add("hidden");
        doorStage?.classList.add("active");
    }, 420);

    window.setTimeout(() => {
        doorStage?.classList.add("open");
    }, 1050);

    window.setTimeout(showWebsite, 3650);
}

window.addEventListener("load", () => {
    if (gatePreview === "open") {
        document.body.classList.add("intro-active");
        if (website) website.style.display = "none";
        loader?.classList.add("is-hidden");
        window.setTimeout(openInvitation, 100);
        return;
    }

    if (previewMode) {
        loader?.classList.add("is-hidden");
        showWebsite();
        return;
    }

    document.body.classList.add("intro-active");
    if (website) website.style.display = "none";

    window.setTimeout(() => {
        loader?.classList.add("is-hidden");
    }, 750);
});

seal?.addEventListener("click", openInvitation);

function updateCountdown() {
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");
    const messageElement = document.getElementById("countdownMessage");

    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

    const targetDate = new Date("2026-08-03T18:00:00+05:30").getTime();

    function tick() {
        const distance = targetDate - Date.now();

        if (distance <= 0) {
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";
            if (messageElement) messageElement.textContent = "The celebration has begun";
            return;
        }

        const days = Math.floor(distance / 86400000);
        const hours = Math.floor((distance % 86400000) / 3600000);
        const minutes = Math.floor((distance % 3600000) / 60000);
        const seconds = Math.floor((distance % 60000) / 1000);

        daysElement.textContent = String(days).padStart(2, "0");
        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");
    }

    tick();
    window.setInterval(tick, 1000);
}

function initRevealAnimations() {
    const items = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px" });

    items.forEach((item) => observer.observe(item));
}

navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        pauseAutoScroll(7000);
    });
});

autoScrollControl?.addEventListener("click", () => {
    window.clearTimeout(autoScrollResumeTimer);

    if (autoScrollComplete) {
        autoScrollComplete = false;
        autoScrollEnabled = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.setTimeout(startAutoScroll, 1200);
        return;
    }

    if (autoScrollActive) {
        autoScrollEnabled = false;
        stopAutoScroll();
    } else {
        autoScrollEnabled = true;
        startAutoScroll();
    }
});

window.addEventListener("wheel", temporarilyPauseAutoScroll, { passive: true });
window.addEventListener("touchstart", (event) => {
    if (!event.target.closest("#autoScrollControl")) temporarilyPauseAutoScroll();
}, { passive: true });
window.addEventListener("pointerdown", (event) => {
    if (!event.target.closest("#autoScrollControl")) temporarilyPauseAutoScroll();
}, { passive: true });

document.addEventListener("keydown", (event) => {
    const scrollKeys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
    if (scrollKeys.includes(event.key)) temporarilyPauseAutoScroll();
});

form?.addEventListener("focusin", () => pauseAutoScroll());
form?.addEventListener("focusout", () => {
    if (autoScrollEnabled) {
        window.clearTimeout(autoScrollResumeTimer);
        autoScrollResumeTimer = window.setTimeout(startAutoScroll, 5000);
    }
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        pauseAutoScroll();
    } else if (autoScrollEnabled && !autoScrollComplete) {
        autoScrollResumeTimer = window.setTimeout(startAutoScroll, 1200);
    }
});

window.addEventListener("scroll", () => {
    siteHeader?.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector("button[type='submit']");
        const originalButtonText = submitButton?.innerHTML;
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending…";
        }

        const data = {
            name: document.getElementById("name")?.value || "",
            mobile: document.getElementById("mobile")?.value || "",
            guests: document.getElementById("guests")?.value || "",
            status: document.getElementById("status")?.value || "",
            message: document.getElementById("message")?.value || ""
        };

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbw0pS7VhpW7Qcs4xSLvWI9TgphGJDvxxAM_VA0DFkEOzSJGerjhTqDSNqk757DCOrNe/exec", {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.message || "Unable to submit RSVP.");

            form.reset();
            popup?.classList.add("show-popup");
        } catch (error) {
            console.error(error);
            window.alert("Unable to submit RSVP. Please try again.");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        }
    });
}

function closePopup() {
    popup?.classList.remove("show-popup");
}

closePopupButton?.addEventListener("click", closePopup);
popup?.addEventListener("click", (event) => {
    if (event.target === popup) closePopup();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePopup();
});

updateCountdown();
updateAutoScrollControl();
