// YouTube Player API
let player;
let isPlaying = false;

// YouTube livestream ID - Using a popular 24/7 lofi hip hop stream as placeholder
// You can replace this with any YouTube video/livestream ID
const YOUTUBE_VIDEO_ID = 'jfKfPfyJRdk'; // Lofi Girl - lofi hip hop radio

// ====================
// PRIVY AUTHENTICATION & SUBSCRIPTION MANAGEMENT
// ====================

// PRIVY CONFIGURATION
const PRIVY_APP_ID = 'cmgtym7vm00wjlh0c3x8eyw53';

// Initialize Privy Client (using vanilla JS approach)
// Load Privy SDK dynamically
let privyLoaded = false;
let privyClient = null;

// Load Privy SDK
function loadPrivySDK() {
    return new Promise((resolve, reject) => {
        if (privyLoaded) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://auth.privy.io/latest/privy.min.js';
        script.async = true;
        script.onload = () => {
            privyLoaded = true;
            initializePrivy();
            resolve();
        };
        script.onerror = () => {
            console.warn('Privy SDK failed to load, using demo mode');
            privyLoaded = false;
            resolve(); // Continue with demo mode
        };
        document.head.appendChild(script);
    });
}

// Initialize Privy
function initializePrivy() {
    if (typeof window.Privy !== 'undefined') {
        try {
            privyClient = new window.Privy({
                appId: PRIVY_APP_ID,
                onSuccess: (user) => {
                    console.log('✅ Privy authentication successful:', user);
                    handlePrivySuccess(user);
                },
                onError: (error) => {
                    console.error('❌ Privy authentication error:', error);
                    showNotification('Authentication failed. Please try again.');
                }
            });
            console.log('🔐 Privy initialized with App ID:', PRIVY_APP_ID);
        } catch (error) {
            console.warn('Privy initialization failed, using demo mode:', error);
            privyClient = null;
        }
    } else {
        console.warn('Privy SDK not available, using demo mode');
    }
}

// Handle successful Privy authentication
function handlePrivySuccess(user) {
    const walletAddress = user.wallet?.address || user.id;
    const userData = {
        address: walletAddress,
        method: user.linkedAccounts?.[0]?.type || 'wallet',
        connectedAt: new Date().toISOString(),
        email: user.email?.address,
        subscriptions: {
            newShows: true,
            liveEvents: true,
            specialMixes: false,
            weeklyDigest: false
        },
        notificationMethod: user.email?.address ? 'email' : 'wallet'
    };
    
    subscriberManager.currentUser = userData;
    localStorage.setItem('aura_current_user', JSON.stringify(userData));
    subscriberManager.addSubscriber(userData);
    subscriberManager.updateUIForConnectedUser();
}

// Subscriber Manager with Privy integration

class SubscriberManager {
    constructor() {
        this.storageKey = 'aura_subscribers';
        this.currentUser = null;
    }

    // Initialize subscriber data
    init() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
        // Check if user was previously connected
        const savedUser = localStorage.getItem('aura_current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIForConnectedUser();
        }
    }

    // Connect wallet using Privy or demo mode
    async connectWallet(method = 'wallet') {
        // Try to use Privy if available
        if (privyClient) {
            try {
                console.log('🔐 Attempting Privy authentication...');
                // Privy handles authentication and calls handlePrivySuccess
                await privyClient.login({
                    loginMethods: method === 'email' ? ['email'] : 
                                 method === 'social' ? ['google', 'twitter', 'discord'] : 
                                 ['wallet']
                });
                return this.currentUser;
            } catch (error) {
                console.warn('Privy authentication failed, using demo mode:', error);
                // Fall back to demo mode
            }
        }

        // Demo mode fallback
        console.log('📝 Using demo mode authentication');
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockAddress = '0x' + this.generateMockAddress();
                const user = {
                    address: mockAddress,
                    method: method,
                    connectedAt: new Date().toISOString(),
                    subscriptions: {
                        newShows: true,
                        liveEvents: true,
                        specialMixes: false,
                        weeklyDigest: false
                    },
                    notificationMethod: 'email'
                };
                this.currentUser = user;
                localStorage.setItem('aura_current_user', JSON.stringify(user));
                this.addSubscriber(user);
                resolve(user);
            }, 1000);
        });
    }

    // Generate mock wallet address
    generateMockAddress() {
        return Array.from({length: 40}, () => 
            Math.floor(Math.random() * 16).toString(16)
        ).join('');
    }

    // Add subscriber to list
    addSubscriber(user) {
        const subscribers = this.getSubscribers();
        const existing = subscribers.findIndex(s => s.address === user.address);
        
        if (existing !== -1) {
            subscribers[existing] = user;
        } else {
            subscribers.push(user);
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(subscribers));
        console.log('📝 Subscriber added:', user.address);
        console.log('📊 Total subscribers:', subscribers.length);
    }

    // Get all subscribers
    getSubscribers() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    // Update subscription preferences
    updatePreferences(preferences) {
        if (!this.currentUser) return;
        
        this.currentUser.subscriptions = preferences.subscriptions;
        this.currentUser.notificationMethod = preferences.notificationMethod;
        
        localStorage.setItem('aura_current_user', JSON.stringify(this.currentUser));
        this.addSubscriber(this.currentUser);
        
        console.log('✅ Preferences updated:', preferences);
    }

    // Disconnect wallet
    disconnect() {
        // Disconnect from Privy if available
        if (privyClient && typeof privyClient.logout === 'function') {
            try {
                privyClient.logout();
                console.log('🔐 Privy logout successful');
            } catch (error) {
                console.warn('Privy logout failed:', error);
            }
        }
        
        this.currentUser = null;
        localStorage.removeItem('aura_current_user');
        this.updateUIForDisconnectedUser();
        console.log('👋 Wallet disconnected');
    }

    // Update UI for connected user
    updateUIForConnectedUser() {
        if (!this.currentUser) return;
        
        // Hide connect button, show profile widget
        const navConnectBtn = document.getElementById('navConnectBtn');
        const profileWidget = document.getElementById('profileWidget');
        
        if (navConnectBtn) navConnectBtn.style.display = 'none';
        if (profileWidget) {
            profileWidget.style.display = 'block';
            
            // Update profile info
            const profileName = document.getElementById('profileName');
            const dropdownAddress = document.getElementById('dropdownAddress');
            const userAddress = document.getElementById('userAddress');
            
            const shortAddress = this.formatAddress(this.currentUser.address);
            if (profileName) profileName.textContent = shortAddress;
            if (dropdownAddress) dropdownAddress.textContent = this.currentUser.address;
            if (userAddress) userAddress.textContent = this.currentUser.address;
        }
    }

    // Update UI for disconnected user
    updateUIForDisconnectedUser() {
        const navConnectBtn = document.getElementById('navConnectBtn');
        const profileWidget = document.getElementById('profileWidget');
        
        if (navConnectBtn) navConnectBtn.style.display = 'block';
        if (profileWidget) profileWidget.style.display = 'none';
    }

    // Format address for display
    formatAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    // Get subscriber stats
    getStats() {
        const subscribers = this.getSubscribers();
        return {
            total: subscribers.length,
            newShows: subscribers.filter(s => s.subscriptions?.newShows).length,
            liveEvents: subscribers.filter(s => s.subscriptions?.liveEvents).length,
            specialMixes: subscribers.filter(s => s.subscriptions?.specialMixes).length,
            weeklyDigest: subscribers.filter(s => s.subscriptions?.weeklyDigest).length
        };
    }
}

// Initialize subscriber manager
const subscriberManager = new SubscriberManager();

// Initialize YouTube Player
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
            'autoplay': 0,
            'controls': 1,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0,
            'fs': 1,
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Player ready callback
function onPlayerReady(event) {
    console.log('YouTube player is ready');
    
    // Set initial volume
    const volumeSlider = document.getElementById('volumeSlider');
    player.setVolume(volumeSlider.value);
}

// Player state change callback
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayPauseButton();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayPauseButton();
    }
}

// Update play/pause button icon
function updatePlayPauseButton() {
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

// Play/Pause control
document.addEventListener('DOMContentLoaded', async function() {
    // Load Privy SDK
    await loadPrivySDK();
    
    // Initialize subscriber manager
    subscriberManager.init();

    // Get DOM elements
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const shareBtn = document.getElementById('shareBtn');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    // Authentication modal elements
    const authModal = document.getElementById('authModal');
    const subscriptionModal = document.getElementById('subscriptionModal');
    const navConnectBtn = document.getElementById('navConnectBtn');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const closeSubscriptionModal = document.getElementById('closeSubscriptionModal');
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    const emailLoginBtn = document.getElementById('emailLoginBtn');
    const socialLoginBtn = document.getElementById('socialLoginBtn');
    const saveSubscriptionBtn = document.getElementById('saveSubscriptionBtn');

    // Profile widget elements
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    const manageSubscriptionBtn = document.getElementById('manageSubscriptionBtn');
    const viewPerksBtn = document.getElementById('viewPerksBtn');
    const disconnectBtn = document.getElementById('disconnectBtn');

    // Modal functions
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Connect wallet button in nav
    navConnectBtn?.addEventListener('click', () => {
        openModal(authModal);
    });

    // Close modal buttons
    closeAuthModal?.addEventListener('click', () => closeModal(authModal));
    closeSubscriptionModal?.addEventListener('click', () => closeModal(subscriptionModal));

    // Close modal on outside click
    authModal?.addEventListener('click', (e) => {
        if (e.target === authModal) closeModal(authModal);
    });
    subscriptionModal?.addEventListener('click', (e) => {
        if (e.target === subscriptionModal) closeModal(subscriptionModal);
    });

    // Wallet connection methods
    async function handleWalletConnect(method) {
        try {
            showNotification('Connecting wallet...');
            closeModal(authModal);
            
            const user = await subscriberManager.connectWallet(method);
            
            // Show subscription modal
            openModal(subscriptionModal);
            
            // Load current preferences
            loadSubscriptionPreferences();
            
            showNotification('✅ Wallet connected successfully!');
        } catch (error) {
            console.error('Connection error:', error);
            showNotification('❌ Connection failed. Please try again.');
        }
    }

    connectWalletBtn?.addEventListener('click', () => handleWalletConnect('wallet'));
    emailLoginBtn?.addEventListener('click', () => handleWalletConnect('email'));
    socialLoginBtn?.addEventListener('click', () => handleWalletConnect('social'));

    // Load subscription preferences into form
    function loadSubscriptionPreferences() {
        if (!subscriberManager.currentUser) return;
        
        const subs = subscriberManager.currentUser.subscriptions;
        document.getElementById('newShowsNotif').checked = subs.newShows;
        document.getElementById('liveEventsNotif').checked = subs.liveEvents;
        document.getElementById('specialMixesNotif').checked = subs.specialMixes;
        document.getElementById('weeklyDigestNotif').checked = subs.weeklyDigest;
        document.getElementById('notificationMethod').value = subscriberManager.currentUser.notificationMethod;
    }

    // Save subscription preferences
    saveSubscriptionBtn?.addEventListener('click', () => {
        const preferences = {
            subscriptions: {
                newShows: document.getElementById('newShowsNotif').checked,
                liveEvents: document.getElementById('liveEventsNotif').checked,
                specialMixes: document.getElementById('specialMixesNotif').checked,
                weeklyDigest: document.getElementById('weeklyDigestNotif').checked
            },
            notificationMethod: document.getElementById('notificationMethod').value
        };
        
        subscriberManager.updatePreferences(preferences);
        closeModal(subscriptionModal);
        showNotification('✅ Subscription preferences saved!');
        
        // Log stats to console
        const stats = subscriberManager.getStats();
        console.log('📊 Subscriber Stats:', stats);
    });

    // Profile dropdown toggle
    profileBtn?.addEventListener('click', () => {
        profileDropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (profileBtn && !profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    // Copy address to clipboard
    copyAddressBtn?.addEventListener('click', async () => {
        if (!subscriberManager.currentUser) return;
        
        try {
            await navigator.clipboard.writeText(subscriberManager.currentUser.address);
            showNotification('📋 Address copied to clipboard!');
        } catch (err) {
            console.error('Copy failed:', err);
        }
    });

    // Manage subscription
    manageSubscriptionBtn?.addEventListener('click', () => {
        profileDropdown.classList.remove('active');
        loadSubscriptionPreferences();
        openModal(subscriptionModal);
    });

    // View perks
    viewPerksBtn?.addEventListener('click', () => {
        profileDropdown.classList.remove('active');
        showNotification('🎁 Check your email for exclusive perks!');
    });

    // Disconnect wallet
    disconnectBtn?.addEventListener('click', () => {
        subscriberManager.disconnect();
        profileDropdown.classList.remove('active');
        showNotification('👋 Wallet disconnected');
    });

    // Play/Pause button
    playPauseBtn.addEventListener('click', function() {
        if (!player) return;
        
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    });

    // Volume control
    volumeSlider.addEventListener('input', function() {
        if (player && player.setVolume) {
            player.setVolume(this.value);
        }
    });

    // Share button
    shareBtn.addEventListener('click', async function() {
        const shareData = {
            title: 'AURA RADIO - Live 24/7 Stream',
            text: 'Check out this amazing radio station streaming live 24/7!',
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                showNotification('Link copied to clipboard!');
            }
        } catch (err) {
            console.log('Share error:', err);
            // Fallback: copy to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                showNotification('Link copied to clipboard!');
            } catch (clipboardErr) {
                console.log('Clipboard error:', clipboardErr);
            }
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
        
        // Animate hamburger icon
        const spans = hamburger.querySelectorAll('span');
        if (mobileMenu.style.display === 'flex') {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.style.display = 'none';
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .schedule-item, .support-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Notification helper
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 1rem 2rem;
        border-radius: 50px;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideUp 0.3s ease;
    `;

    // Add animation keyframes
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @keyframes slideDown {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Update now playing text (you can customize this to fetch real data)
function updateNowPlaying() {
    const nowPlayingText = document.getElementById('nowPlaying');
    const tracks = [
        'Chillhop Radio - jazzy & lofi hip hop beats',
        'Late Night Study Session - Ambient Sounds',
        'Coffee Shop Vibes - Acoustic Mix',
        'Downtown Groove - Electronic Jazz',
        'Midnight Drive - Synthwave Collection'
    ];
    
    let currentIndex = 0;
    
    setInterval(() => {
        currentIndex = (currentIndex + 1) % tracks.length;
        nowPlayingText.style.opacity = '0';
        
        setTimeout(() => {
            nowPlayingText.textContent = tracks[currentIndex];
            nowPlayingText.style.opacity = '1';
        }, 300);
    }, 30000); // Change every 30 seconds
}

// Initialize now playing text animation
document.addEventListener('DOMContentLoaded', function() {
    const nowPlayingText = document.getElementById('nowPlaying');
    nowPlayingText.style.transition = 'opacity 0.3s ease';
    updateNowPlaying();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Space bar to play/pause
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        document.getElementById('playPauseBtn').click();
    }
    
    // Arrow up/down for volume
    if (e.code === 'ArrowUp') {
        e.preventDefault();
        const volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
        volumeSlider.dispatchEvent(new Event('input'));
    }
    
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        const volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
        volumeSlider.dispatchEvent(new Event('input'));
    }
});

