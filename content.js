
let isEnabled = true;
let whitelist = [];

/* -------------------------
   NORMALIZE DOMAIN
-------------------------- */
function normalize(domain) {
    return domain
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0]
        .toLowerCase();
}

/* -------------------------
   WHITELIST CHECK
-------------------------- */
function isWhitelisted() {
    const current = normalize(location.hostname);

    return whitelist.some(site => {
        const clean = normalize(site);
        return current === clean || current.endsWith("." + clean);
    });
}

/* -------------------------
   STATE SYNC (IMPORTANT FIX)
-------------------------- */
chrome.storage.sync.get(["isExtensionEnabled", "whitelistedSites"], (data) => {
    isEnabled = data.isExtensionEnabled ?? true;
    whitelist = data.whitelistedSites || [];

    if (isEnabled && !isWhitelisted()) {
        processFrames();
    }
});

/* live updates */
chrome.storage.onChanged.addListener((changes, area) => {

    if (area !== "sync") return;

    if (changes.isExtensionEnabled) {
        isEnabled = changes.isExtensionEnabled.newValue;

        if (!isEnabled) {
            restoreFrames(); // IMPORTANT FIX
        } else {
            processFrames();
        }
    }

    if (changes.whitelistedSites) {
        whitelist = changes.whitelistedSites.newValue || [];
    }
});

/* -------------------------
   AD DETECTION
-------------------------- */
function isAdFrame(frame) {
    const str = (
        frame.id +
        " " +
        frame.className +
        " " +
        frame.src
    ).toLowerCase();

    return (
        str.includes("ad") ||
        str.includes("ads") ||
        str.includes("doubleclick") ||
        str.includes("banner") ||
        str.includes("sponsor")
    );
}

/* -------------------------
   ICE MODE APPLY
-------------------------- */
function iceMode(frame) {

    if (frame.dataset.originalStyle) return;

    frame.dataset.originalStyle = frame.getAttribute("style") || "";

    frame.style.opacity = "0.02";
    frame.style.pointerEvents = "none";
    frame.style.transform = "scaleY(0.02)";
    frame.style.transformOrigin = "top";
}

/* -------------------------
   RESTORE (IMPORTANT FIX)
-------------------------- */
function restoreFrames() {

    document.querySelectorAll("iframe").forEach(frame => {

        if (frame.dataset.originalStyle !== undefined) {
            frame.setAttribute("style", frame.dataset.originalStyle);
            delete frame.dataset.originalStyle;
        }

        frame.dataset.processed = "";
    });
}

/* -------------------------
   MAIN PROCESS
-------------------------- */
function processFrames() {

    if (!isEnabled) return;

    if (isWhitelisted()) return;

    document.querySelectorAll("iframe").forEach(frame => {

        if (frame.dataset.processed) return;

        if (isAdFrame(frame)) {
            iceMode(frame);
        }

        frame.dataset.processed = "true";
    });
}

/* -------------------------
   OBSERVER (SAFE)
-------------------------- */
const observer = new MutationObserver(() => {

    if (!isEnabled) return;

    if (isWhitelisted()) return;

    processFrames();
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});