chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['isExtensionEnabled', 'whitelistedSites'], (data) => {
        if (data.isExtensionEnabled === undefined) {
            chrome.storage.sync.set({ isExtensionEnabled: true });
        }
        if (!Array.isArray(data.whitelistedSites)) {
            chrome.storage.sync.set({ whitelistedSites: [] });
        }
    });
});