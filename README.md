# ❄ IceBlock

IceBlock is a lightweight Chrome extension that reduces ads by intelligently detecting and visually neutralizing ad elements without breaking page layouts.

Instead of removing content, it applies a “freeze” effect to ads so websites stay functional and stable.

---

## ✨ Features

* ❄ Smart iframe ad detection
* 🧊 “Ice mode” visual ad neutralization
* 🌐 Whitelist support (site bypass)
* ⚡ Enable / disable protection instantly
* 🌙 Dark / Light mode toggle
* 🖼️ Favicon previews for whitelisted sites
* 🧠 Uses real ad filter data for improved detection

---

## 📦 Installation (Developer Mode)

1. Click the green **Code** button at the top of the repository
2. Select **Download ZIP**
3. Extract the ZIP file
4. Open Chrome and go to: chrome://extensions/
5. Enable **Developer mode** (top right)
6. Click **Load unpacked**
7. Select the extracted folder

---

## 🧊 How it works

IceBlock does not fully remove ads.

Instead, it:

* Detects ad iframes and known ad domains
* Applies a visual “freeze” effect
* Prevents interaction with ad elements
* Keeps page layout intact

This helps avoid broken websites while still reducing ad visibility.

---

## 📚 Filter List Credit

IceBlock uses data derived from:

[https://filters.adavoid.org/ultimate-ad-filter.txt](https://filters.adavoid.org/ultimate-ad-filter.txt)

This filter list helps improve detection of known advertising and tracking domains.

---

## 🚧 Notes

* Some ads may still appear depending on how they are loaded (especially server-side or script-injected ads)
* Whitelisted sites will not be modified
* Performance depends on filter list size and page complexity
