# Productivity Blocker - Chromium Extension

A powerful browser extension for Chrome/Edge that blocks distracting websites to help you stay focused and productive.

## Features

✅ **Easy Site Management** - Add/remove blocked sites via a clean, intuitive popup interface  
✅ **Popular Sites Dashboard** - See your top 10 most visited sites and block them with one click  
✅ **Subdomain Blocking** - Automatically blocks all subdomains (e.g., blocking reddit.com also blocks old.reddit.com, m.reddit.com)  
✅ **Persistent Blocking** - Your blocked sites list is saved locally and persists across browser sessions  
✅ **Friendly Block Page** - Shows an encouraging message when you try to access a blocked site  
✅ **Resizable Popup** - Large, clean interface (650px × 700px) with smooth scrolling  
✅ **Real-time Updates** - Popular sites list updates instantly when you block/unblock sites  
✅ **Lightweight** - Minimal performance impact using modern Manifest V3 APIs

## Installation

### Step 1: Prepare the Extension Files

1. Create a folder called `ProductivityBlocker` on your computer
2. Copy these files into that folder:
   - `manifest.json`
   - `popup.html`
   - `popup.js`
   - `background.js`
3. Create a subfolder called `icons`
4. Copy these files into that folder:
   - `icon-16.png`
   - `icon-48.png`
   - `icon-128.png`

### Step 2: Load the Extension in Chrome/Edge

1. Open Chrome or Edge
2. Go to `chrome://extensions/` or `edge://extensions/`
3. Enable **"Developer mode"** (toggle in the top-right or bottom-left)
4. Click **"Load unpacked"**
5. Select your `ProductivityBlocker` folder
6. The extension is now installed! 🎉

### Step 3: Pin the Extension (Optional)

1. Click the **Extensions icon** (puzzle piece) in the toolbar
2. Find "Productivity Blocker"
3. Click the **pin icon** to add it to your toolbar

## Usage

### Adding Blocked Sites

1. Click the **Productivity Blocker icon** in your toolbar
2. Enter a domain name (e.g., `reddit.com`, `twitter.com`, `facebook.com`)
3. Click **"Add"** or press Enter
4. The site is now blocked!

### Tips for Entering Sites

- ✅ Good: `reddit.com`, `twitter.com`, `youtube.com`
- ✅ Also works: `www.reddit.com`, `https://reddit.com` (auto-cleaned)
- ❌ Don't use: `https://www.reddit.com/r/programming` (too specific)

The extension automatically:
- Removes `https://`, `http://`, and `www.` prefixes
- Blocks all subdomains (e.g., `reddit.com` blocks `old.reddit.com`, `m.reddit.com`, etc.)
- Blocks both `example.com` and `www.example.com`

### Removing Blocked Sites

1. Click the Productivity Blocker icon
2. Find the site in the list
3. Click **"Remove"** next to it
4. The site is now unblocked

### What Happens When You Try to Access a Blocked Site?

You'll see a friendly block page showing:
- The blocked site URL
- An encouraging message
- Options to go back or access extension settings
- A timer showing how long you've been away from distracting sites

## Troubleshooting

### Extension doesn't appear in my toolbar
- Go to `edge://extensions/`
- Find "Productivity Blocker"
- Click the pin icon to add it to your toolbar

### Sites still loading even though they're in the list
- Try refreshing the page or closing and reopening the tab
- Make sure you entered the domain correctly (without `/paths` or `?queries`)
- Restart Edge to ensure the extension is fully loaded

### I want to temporarily disable the extension
- Go to `edge://extensions/`
- Toggle off "Productivity Blocker"
- Toggle it back on when you want to resume blocking

### I forgot which sites I blocked
- Click the Productivity Blocker icon - all blocked sites are listed there

## How It Works

1. **Manifest V3 API**: Uses Chrome/Edge's modern `declarativeNetRequest` API for efficient blocking
2. **Persistent Rules**: Blocking rules persist across browser sessions using dynamic rules (not session-only)
3. **Local Storage**: All blocked sites are stored locally on your computer (never synced or transmitted)
4. **Smart Blocking**: Automatically blocks the domain and all subdomains (e.g., blocking `reddit.com` also blocks `m.reddit.com`, `old.reddit.com`, etc.)
5. **Friendly Block Page**: Shows an encouraging message when you hit a blocked site
6. **Real-time Updates**: Popular sites list updates instantly when you block/unblock sites
7. **Browsing Analytics**: Displays your top 10 most visited sites so you can see exactly what's distracting you

## Customization Ideas

Want to enhance the extension? Here are some ideas:

- Add a **"Pause blocking for X minutes"** feature
- Create **site categories** (Social Media, Entertainment, etc.)
- Add a **schedule** to only block sites during work hours
- Implement **Chrome Sync** to sync blocked sites across devices
- Add **weekly stats** showing sites blocked and time saved

## Permissions Explained

- **storage**: Saves your blocked sites list locally
- **tabs**: Manages browser tabs when redirecting
- **webRequest**: Monitors navigation to intercept blocked sites
- **host_permissions**: Allows blocking any website

## Tips for Maximum Productivity

1. **Be Honest**: Add sites you actually struggle with
2. **Start Small**: Block 3-5 sites first, adjust as needed
3. **Use Strategic Timing**: Keep it on during work/study hours
4. **Review Weekly**: Check your list and adjust as needed
5. **Combine with Other Tools**: Use with focus apps or website timers for best results

## Support & Issues

If you encounter any issues:
1. Check that all files are in the same folder
2. Try disabling and re-enabling the extension
3. Restart Microsoft Edge
4. Uninstall and reinstall the extension

---

**Stay focused. Stay productive. You've got this! 🚀**
