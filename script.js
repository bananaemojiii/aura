// YouTube Player API
let player;
let isPlaying = false;

// YouTube livestream ID - Using a popular 24/7 lofi hip hop stream as placeholder
// You can replace this with any YouTube video/livestream ID
const YOUTUBE_VIDEO_ID = 'jfKfPfyJRdk'; // Lofi Girl - lofi hip hop radio

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
document.addEventListener('DOMContentLoaded', function() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const shareBtn = document.getElementById('shareBtn');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

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

