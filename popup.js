document.addEventListener("DOMContentLoaded", () => {

    const powerBtn = document.getElementById("powerBtn");
    const statusText = document.getElementById("statusText");

    const whitelistInput = document.getElementById("whitelistInput");
    const addBtn = document.getElementById("addBtn");
    const whitelist = document.getElementById("whitelist");

    const themeBtn = document.getElementById("themeBtn");
    const themeIcon = document.getElementById("themeIcon");

    let isEnabled = true;
    let isDark = true;

    // ---------------- INIT ----------------
    chrome.storage.sync.get(
        ["isExtensionEnabled", "whitelistedSites", "darkMode"],
        (data) => {

            isEnabled = data.isExtensionEnabled ?? true;
            isDark = data.darkMode ?? true;

            updateUI();
            applyTheme();

            renderWhitelist(data.whitelistedSites || []);
        }
    );

    // ---------------- POWER ----------------
    powerBtn.onclick = () => {
        isEnabled = !isEnabled;

        chrome.storage.sync.set({ isExtensionEnabled: isEnabled });

        updateUI();

        send({ action: "updateExtensionState", isEnabled });
    };

    function updateUI() {

        powerBtn.classList.toggle("active", isEnabled);

        statusText.textContent = isEnabled
            ? "Protection: ENABLED"
            : "Protection: DISABLED";

        statusText.style.color = isEnabled ? "#22c55e" : "#f87171";
    }

    // ---------------- THEME ----------------
    themeBtn.onclick = () => {
        isDark = !isDark;

        chrome.storage.sync.set({ darkMode: isDark });

        applyTheme();

        send({ action: "updateDarkMode", enabled: isDark });
    };

    function applyTheme() {

        document.body.classList.toggle("dark", isDark);
        document.body.classList.toggle("light", !isDark);

        themeIcon.className = isDark
            ? "fa-solid fa-moon"
            : "fa-solid fa-sun";

        themeIcon.style.color = isDark ? "white" : "#111";
    }

    // ---------------- FAVICON ----------------
    function getFavicon(domain) {

        return new Promise((resolve) => {

            const cached = localStorage.getItem("favicon_" + domain);
            if (cached) return resolve(cached);

            const url1 = `https://${domain}/favicon.ico`;
            const url2 = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

            const img = new Image();

            img.onload = () => {
                localStorage.setItem("favicon_" + domain, url1);
                resolve(url1);
            };

            img.onerror = () => {
                localStorage.setItem("favicon_" + domain, url2);
                resolve(url2);
            };

            img.src = url1;
        });
    }

    // ---------------- WHITELIST ----------------
    addBtn.onclick = () => {

        const site = whitelistInput.value.trim();
        if (!site) return;

        chrome.storage.sync.get(["whitelistedSites"], (data) => {

            let list = data.whitelistedSites || [];

            if (!list.includes(site)) {

                list.push(site);

                chrome.storage.sync.set({ whitelistedSites: list });

                renderWhitelist(list);

                send({
                    action: "updateWhitelist",
                    whitelistedSites: list
                });
            }
        });

        whitelistInput.value = "";
    };

    async function renderWhitelist(list) {

        whitelist.innerHTML = "";

        for (const site of list) {

            const li = document.createElement("li");

            const domain = site.replace(/^https?:\/\//, "").split("/")[0];

            const icon = await getFavicon(domain);

            li.innerHTML = `
                <div class="site">
                    <img class="favicon" src="${icon}">
                    <span>${site}</span>
                </div>

                <button class="removeBtn">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;

            li.querySelector(".removeBtn").onclick = () => remove(site);

            whitelist.appendChild(li);
        }
    }

    function remove(site) {

        chrome.storage.sync.get(["whitelistedSites"], (data) => {

            let list = data.whitelistedSites || [];
            list = list.filter(s => s !== site);

            chrome.storage.sync.set({ whitelistedSites: list });

            renderWhitelist(list);

            send({
                action: "updateWhitelist",
                whitelistedSites: list
            });
        });
    }

    // ---------------- MESSAGE ----------------
    function send(msg) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, msg);
        });
    }

});