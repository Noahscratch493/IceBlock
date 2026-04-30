
let adDomains = [];

async function fetchFilters() {
    try {
        const res = await fetch("https://filters.adavoid.org/ultimate-ad-filter.txt");
        const text = await res.text();

        adDomains = parseFilterList(text);

        console.log("IceBlock loaded domains:", adDomains.length);

    } catch (e) {
        console.error("Failed to fetch filter list", e);
    }
}

function parseFilterList(text) {

    const lines = text.split("\n");
    const domains = [];

    for (let line of lines) {

        line = line.trim();

        // ignore comments + empty
        if (!line || line.startsWith("!") || line.startsWith("@@")) continue;

        // only rules starting with ||
        if (!line.startsWith("||")) continue;

        // remove ||
        let domain = line.slice(2);

        // cut at ^
        domain = domain.split("^")[0];

        // remove options ($...)
        domain = domain.split("$")[0];

        if (domain) domains.push(domain.toLowerCase());
    }

    return [...new Set(domains)];
}

// fetch on startup
fetchFilters();

// refresh every 24h
setInterval(fetchFilters, 24 * 60 * 60 * 1000);

// send to content script when asked
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "getDomains") {
        sendResponse({ domains: adDomains });
    }
});