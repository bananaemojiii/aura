# Privy Integration Guide

This document explains how to integrate the actual [Privy](https://www.privy.io/) SDK for production use.

## Current Implementation

The current implementation uses a **simulated** authentication system that:
- Stores wallet connections in localStorage
- Generates mock wallet addresses
- Manages subscriber preferences locally

This is perfect for development, testing, and demonstration purposes.

## Production Integration with Privy

To use actual Privy authentication in production, follow these steps:

### 1. Sign Up for Privy

1. Visit [https://www.privy.io/](https://www.privy.io/)
2. Click "Get started" and create an account
3. Create a new app in the Privy dashboard
4. Copy your **App ID** from the dashboard

### 2. Install Privy SDK

For a React application:

```bash
npm install @privy-io/react-auth
# or
yarn add @privy-io/react-auth
```

For vanilla JavaScript (current implementation), you can use the CDN:

```html
<script type="module">
  import { PrivyProvider } from 'https://esm.sh/@privy-io/react-auth@latest';
</script>
```

### 3. Initialize Privy

Replace the simulated authentication in `script.js` with actual Privy integration:

```javascript
// Instead of the SubscriberManager class, use Privy:

import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient({
  appId: 'YOUR_PRIVY_APP_ID',
  appSecret: 'YOUR_PRIVY_APP_SECRET',
});

// For client-side (recommended approach)
// Wrap your app with PrivyProvider (if using React)
// Or use Privy's vanilla JS SDK
```

### 4. Update Authentication Flow

Replace the wallet connection methods:

```javascript
// Current (simulated):
async connectWallet(method = 'wallet') {
    const mockAddress = '0x' + this.generateMockAddress();
    // ... mock implementation
}

// Production (with Privy):
import { usePrivy } from '@privy-io/react-auth';

function WalletConnect() {
    const { login, authenticated, user } = usePrivy();
    
    const handleConnect = async () => {
        await login();
        // User is now authenticated
        // user.wallet.address contains the actual wallet address
    };
}
```

### 5. Backend Integration

For production, you'll want to verify authentication on your backend:

```javascript
// Backend API endpoint
const express = require('express');
const { PrivyClient } = require('@privy-io/server-auth');

const app = express();
const privy = new PrivyClient({
    appId: process.env.PRIVY_APP_ID,
    appSecret: process.env.PRIVY_APP_SECRET,
});

app.post('/api/subscribe', async (req, res) => {
    const authToken = req.headers.authorization;
    
    try {
        // Verify the user's authentication
        const user = await privy.verifyAuthToken(authToken);
        
        // Add to subscriber database
        await addSubscriber({
            address: user.wallet.address,
            preferences: req.body.preferences
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
});
```

### 6. Store Subscribers in Database

Replace localStorage with a proper database:

```javascript
// MongoDB example
const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    method: String,
    connectedAt: { type: Date, default: Date.now },
    subscriptions: {
        newShows: Boolean,
        liveEvents: Boolean,
        specialMixes: Boolean,
        weeklyDigest: Boolean
    },
    notificationMethod: String,
    email: String
});

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

// Add subscriber
async function addSubscriber(data) {
    const subscriber = new Subscriber(data);
    await subscriber.save();
}

// Get all subscribers
async function getSubscribers() {
    return await Subscriber.find({});
}
```

### 7. Implement Notification System

Send actual notifications to subscribers:

```javascript
// Email notifications (using SendGrid, Mailgun, etc.)
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function notifySubscribers(type, message) {
    const subscribers = await Subscriber.find({
        [`subscriptions.${type}`]: true,
        notificationMethod: { $in: ['email', 'both'] }
    });
    
    for (const subscriber of subscribers) {
        await sgMail.send({
            to: subscriber.email,
            from: 'notifications@auraradio.com',
            subject: 'New Show Alert - Aura Radio',
            html: message
        });
    }
}

// Wallet notifications (using XMTP, Push Protocol, etc.)
// For on-chain notifications
```

## Privy Features You Can Use

Based on [Privy's documentation](https://www.privy.io/), here are key features:

### Authentication Methods
- **Wallet Connection**: MetaMask, WalletConnect, Coinbase Wallet
- **Email**: Passwordless email authentication
- **Social**: Google, Twitter, Discord, etc.
- **SMS**: Phone number authentication
- **Passkeys**: Biometric authentication

### Security Features
- Hardware-isolated TEEs (Trusted Execution Environments)
- Key sharding and encryption
- SOC 2 Type II compliant
- Multi-approver quorums
- Transaction MFA

### Advanced Features
- **Embedded Wallets**: Create wallets for users automatically
- **Gas Sponsorship**: Pay gas fees for your users
- **Smart Wallet Integration**: Support for account abstraction
- **Multi-chain Support**: EVM, Solana, Bitcoin

## Configuration Example

Create a `.env` file:

```env
# Privy Configuration
PRIVY_APP_ID=your_app_id_here
PRIVY_APP_SECRET=your_app_secret_here

# Database
MONGODB_URI=mongodb://localhost:27017/aura-radio

# Email Service
SENDGRID_API_KEY=your_sendgrid_key

# Application
PORT=3000
```

## Migration Steps

1. **Keep the current demo** working for development
2. **Set up Privy account** and get credentials
3. **Create backend API** to handle authentication verification
4. **Set up database** for subscriber management
5. **Implement email service** for notifications
6. **Update frontend** to use Privy SDK
7. **Test thoroughly** with test wallets
8. **Deploy to production**

## Testing

Privy provides a test mode for development:

```javascript
const privy = new PrivyClient({
    appId: 'test-app-id',
    testMode: true, // Use test mode
});
```

## Resources

- [Privy Documentation](https://docs.privy.io/)
- [Privy GitHub](https://github.com/privy-io)
- [Example Apps](https://docs.privy.io/guide/quickstart)
- [Security Audits](https://www.privy.io/security)

## Cost Considerations

Privy offers:
- **Free Tier**: Up to 10,000 monthly active users
- **Growth Plan**: Custom pricing for larger applications
- **Enterprise**: Custom solutions with SLA

Check [Privy Pricing](https://www.privy.io/pricing) for current rates.

## Support

If you need help with integration:
- Privy Documentation: https://docs.privy.io/
- Privy Discord: Join their community
- Email: support@privy.io

---

**Note**: The current implementation is fully functional for demonstration purposes. You can use it to test the subscriber management system before committing to a Privy subscription.

