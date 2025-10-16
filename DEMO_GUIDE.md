# Demo Guide - Wallet Connection & Subscriptions

Quick guide to test the new authentication and subscriber features!

## 🎮 How to Test

### 1. Open the App
Open `index.html` in your web browser (or use a local server).

### 2. Connect Your "Wallet"

**Step 1:** Click the **"Connect Wallet"** button in the top navigation bar

**Step 2:** A modal will appear with three authentication options:
- 🔐 Connect Wallet (simulates MetaMask/WalletConnect)
- ✉️ Sign in with Email
- 👤 Social Login

**Step 3:** Click any option - they all work the same in demo mode

**Step 4:** Wait ~1 second for the "connection" to complete

### 3. Subscribe to Notifications

After connecting, the **Subscription Modal** automatically appears:

**Welcome Section:**
- Shows your mock wallet address (starts with `0x...`)
- Displays a success checkmark

**Subscription Options:**
Choose what you want to be notified about:
- ✅ New Shows & Guest DJs (checked by default)
- ✅ Live Events & Performances (checked by default)
- ☐ Special Mixes & Recordings
- ☐ Weekly Program Digest

**Notification Method:**
Select how you want to receive notifications:
- Email
- Wallet Notification
- Both

**Subscriber Perks:**
View the exclusive benefits:
- 🎵 Early access to exclusive mixes
- 🎟️ Priority access to live events
- 💎 Special NFT drops
- 🎁 Monthly giveaways

**Step 5:** Click **"Save Preferences"**

### 4. Profile Management

After saving, you'll see a **Profile Widget** in the top-right corner:

**Profile Button:**
- Shows your wallet avatar (gradient circle)
- Displays shortened address (e.g., `0x1234...5678`)

**Click the profile button** to open the dropdown menu:

**Dropdown Options:**
1. **Your Address** - Shows full wallet address with copy button 📋
2. **Manage Subscription** - Edit your notification preferences
3. **View Perks** - Get info about subscriber benefits
4. **Disconnect** - Sign out

### 5. Test Features

**Copy Address:**
- Click the copy icon next to your address
- See confirmation notification: "📋 Address copied to clipboard!"

**Update Preferences:**
- Click "Manage Subscription"
- Change your notification settings
- Click "Save Preferences"
- See success message

**Disconnect:**
- Click "Disconnect"
- Profile widget disappears
- "Connect Wallet" button reappears

### 6. Check Console Logs

Open your browser's Developer Console (F12) to see:

```
📝 Subscriber added: 0x1234...
📊 Total subscribers: 1
✅ Preferences updated: {...}
📊 Subscriber Stats: {
  total: 1,
  newShows: 1,
  liveEvents: 1,
  specialMixes: 0,
  weeklyDigest: 0
}
```

## 🔍 Data Persistence

The demo uses **localStorage** to persist data:

**Try this:**
1. Connect wallet and set preferences
2. Refresh the page
3. Your profile should still be connected!
4. Preferences are saved

**To reset everything:**
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

## 🎨 UI Features to Notice

### Animations
- Smooth modal fade-in/slide-up
- Pulsing "LIVE NOW" badge
- Success icon scale animation
- Button hover effects
- Dropdown slide-down

### Responsive Design
- Modals work on mobile/tablet
- Profile widget adapts to smaller screens
- Touch-friendly buttons

### Accessibility
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader friendly
- High contrast text
- Clear focus indicators

## 📊 Testing Multiple Subscribers

To simulate multiple users:

1. Connect wallet → Save preferences
2. Open browser console
3. Run: `localStorage.removeItem('aura_current_user')`
4. Refresh page
5. Connect again (new mock address generated)
6. Repeat to add more subscribers

**View all subscribers:**
```javascript
// In browser console:
JSON.parse(localStorage.getItem('aura_subscribers'))
```

## 🐛 Troubleshooting

**Modal not appearing?**
- Check browser console for errors
- Make sure JavaScript is enabled
- Try hard refresh (Ctrl+Shift+R)

**Profile not showing after refresh?**
- Check if localStorage is enabled
- Try incognito/private mode
- Clear cache and reload

**Can't disconnect?**
- Refresh the page
- Manually clear: `localStorage.removeItem('aura_current_user')`

## 💡 Tips

1. **Open Console** - More info logged there!
2. **Test on Mobile** - Great responsive design
3. **Try All Options** - Each auth method works
4. **Update Preferences** - Test the manage subscription flow
5. **Copy Address** - Test clipboard functionality

## 🚀 Next Steps

When ready for production:
1. Read `PRIVY_INTEGRATION.md`
2. Sign up for Privy account
3. Replace mock implementation
4. Add backend API
5. Set up database
6. Implement email service

---

Enjoy testing! 🎉

**Questions?** Check out:
- `README.md` - Full documentation
- `PRIVY_INTEGRATION.md` - Production setup
- [Privy Docs](https://docs.privy.io/)

