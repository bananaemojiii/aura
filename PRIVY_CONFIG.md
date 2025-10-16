# Privy Configuration

## App ID
Your Privy App ID is now configured in the application:

```javascript
PRIVY_APP_ID = 'cmgtym7vm00wjlh0c3x8eyw53'
```

## Current Setup

The application now uses a **hybrid approach**:

### ✅ Real Privy Integration
- Loads Privy SDK dynamically from `https://auth.privy.io/latest/privy.min.js`
- Uses your actual App ID for authentication
- Attempts real wallet connections when Privy SDK loads
- Handles Privy callbacks for successful authentication

### 🔄 Fallback Demo Mode
- If Privy SDK fails to load → falls back to demo mode
- If Privy authentication fails → uses mock addresses
- Ensures app always works, even without Privy

## How It Works

1. **Page loads** → Privy SDK loads automatically
2. **User clicks "Connect Wallet"** → Tries Privy authentication
3. **If successful** → Real wallet address from Privy
4. **If failed** → Demo mode with mock address

## Console Messages

Watch your browser console for:
- `🔐 Privy initialized with App ID: cmgtym7vm00wjlh0c3x8eyw53`
- `✅ Privy authentication successful`
- `🔐 Attempting Privy authentication...`
- Or fallback: `📝 Using demo mode authentication`

## Testing

### Test Real Privy:
1. Open the app in browser
2. Check console for "Privy initialized"
3. Click "Connect Wallet"
4. Should see Privy's authentication flow

### Test Demo Fallback:
1. If Privy fails → automatic fallback
2. Works offline
3. Mock addresses generated

## Next Steps

To complete Privy setup:

1. **Configure your Privy Dashboard:**
   - Login to [dashboard.privy.io](https://dashboard.privy.io)
   - Add your domain to allowed origins
   - Enable authentication methods (wallet, email, social)
   - Configure webhooks for notifications

2. **Set Allowed Domains:**
   ```
   http://localhost:8000
   http://127.0.0.1:8000
   https://your-domain.com
   ```

3. **Enable Login Methods:**
   - ✅ Wallet (MetaMask, WalletConnect, Coinbase)
   - ✅ Email (passwordless)
   - ✅ Social (Google, Twitter, Discord)

4. **Webhook Configuration:**
   For subscriber notifications, set up:
   - User authenticated webhook
   - User updated webhook
   - Send to your backend API

## Environment Variables (For Production)

Create a `.env` file:

```env
# Privy
PRIVY_APP_ID=cmgtym7vm00wjlh0c3x8eyw53
PRIVY_APP_SECRET=your_secret_here

# Your backend API
API_URL=https://api.yourdomain.com

# Database
DATABASE_URL=your_database_url
```

## Security Notes

⚠️ **Important:**
- The App ID is **public** (safe in frontend code)
- The App **Secret** is **private** (backend only)
- Never expose App Secret in frontend
- Always verify tokens on backend

## Debugging

Enable verbose logging:

```javascript
// Add to script.js for debugging
console.log('Privy Client:', privyClient);
console.log('Privy Loaded:', privyLoaded);
```

## Support Resources

- [Privy Dashboard](https://dashboard.privy.io)
- [Privy Documentation](https://docs.privy.io)
- [API Reference](https://docs.privy.io/reference/api)
- Your App ID: `cmgtym7vm00wjlh0c3x8eyw53`

## Current Features

✅ Dynamic SDK loading  
✅ Graceful fallback  
✅ Multiple auth methods  
✅ Persistent sessions  
✅ Real + demo modes  
✅ Error handling  

---

**Status:** 🟢 Privy App ID configured and ready!

Test it now by opening `index.html` and clicking "Connect Wallet"

