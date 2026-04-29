# ❄ IceBlock

IceBlock is a lightweight Chrome extension that reduces ads by intelligently detecting and visually neutralizing ad elements without breaking page layouts.

Instead of removing content, it applies a “freeze” effect to ads so websites stay functional and stable.

---

## ✨ Features

- ❄ Smart iframe ad detection
- 🧊 “Ice mode” visual ad neutralization
- 🌐 Whitelist support (site bypass)
- ⚡ Enable / disable protection instantly
- 🌙 Dark / Light mode toggle
- 🖼️ Favicon previews for whitelisted sites
- 🧠 Works on dynamic pages (MutationObserver)

---

## 📦 Installation (Developer Mode)

Since IceBlock is not on the Chrome Web Store, you need to install it manually.

### 1. Download the extension

1. Click the green **Code** button at the top of the repository
2. Select **Download ZIP**
3. Extract the ZIP file to a folder on your computer

---

### 2. Open Chrome Extensions page

1. Open Google Chrome
2. Go to: `chrome://extensions/`

---

### 3. Enable Developer Mode

1. In the top-right corner, turn on **Developer mode**

---

### 4. Load the extension

1. Click **Load unpacked**
2. Select the extracted IceBlock folder
3. The extension will now appear in your browser

---

## 🧊 How to use

1. Click the IceBlock icon in your toolbar
2. Press the power button to enable/disable protection
3. Add websites to whitelist if needed
4. Toggle dark/light mode using the icon in the top corner

---

## ⚙️ How it works

IceBlock does not fully remove ads.

Instead, it:
- Detects common ad iframes and containers
- Applies visual “freeze” effects
- Prevents interaction with ad elements
- Keeps page layout intact

This helps avoid broken websites while still reducing ad visibility.

---

## 🚧 Notes

- Some ads may still appear depending on how they are loaded (especially server-side injected ads)
- Whitelisted sites will not be modified
- Best results on iframe-based ad systems

---

## 📄 License

Free to use and modify for personal projects.
