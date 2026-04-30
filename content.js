let isEnabled = true;
let whitelist = [];
let adDomains = [];

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
   LOAD INITIAL STATE
-------------------------- */
chrome.storage.sync.get(
    ["isExtensionEnabled", "whitelistedSites"],
    (data) => {
        isEnabled = data.isExtensionEnabled ?? true;
        whitelist = data.whitelistedSites || [];

        init();
    }
);

/* -------------------------
   GET FILTER DOMAINS
-------------------------- */
function loadDomains() {
    chrome.runtime.sendMessage({ action: "getDomains" }, (res) => {
        if (res && res.domains) {
            adDomains = res.domains;
            processFrames();
        }
    });
}

/* -------------------------
   STORAGE SYNC
-------------------------- */
chrome.storage.onChanged.addListener((changes, area) => {

    if (area !== "sync") return;

    if (changes.isExtensionEnabled) {
        isEnabled = changes.isExtensionEnabled.newValue;

        if (!isEnabled) {
            restoreFrames();
        } else {
            processFrames();
        }
    }

    if (changes.whitelistedSites) {
        whitelist = changes.whitelistedSites.newValue || [];

        if (isWhitelisted()) {
            restoreFrames();
        } else {
            processFrames();
        }
    }
});

/* -------------------------
   AD DETECTION (UPGRADED)
-------------------------- */
function isAdFrame(frame) {

    try {
        const url = new URL(frame.src);

        const domainMatch = adDomains.some(domain =>
            url.hostname === domain ||
            url.hostname.endsWith("." + domain)
        );

        const keywordMatch = (
            frame.id +
            " " +
            frame.className
        ).toLowerCase().includes("ad");

        return domainMatch || keywordMatch;

    } catch {
        return false;
    }
}

/* -------------------------
   ICE MODE
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
   RESTORE (IMPORTANT)
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
   PROCESS FRAMES
-------------------------- */
function processFrames() {

    if (!isEnabled) return;
    if (isWhitelisted()) return;
    if (!adDomains.length) return; // wait for list

    document.querySelectorAll("iframe").forEach(frame => {

        if (frame.dataset.processed) return;

        if (isAdFrame(frame)) {
            iceMode(frame);
        }

        frame.dataset.processed = "true";
    });
}

/* -------------------------
   OBSERVER
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

/* -------------------------
   INIT
-------------------------- */
function init() {
    loadDomains();
    processFrames();
}