# AURA RADIO 📻

A modern, beautiful online radio streaming web application inspired by The Lot Radio. Features a clean, responsive design with live YouTube stream integration and interactive controls.

![AURA RADIO](https://img.shields.io/badge/status-live-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

- **Live Streaming** - YouTube livestream integration with custom player controls
- **Modern UI** - Beautiful gradient design with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Interactive Controls** - Play/pause, volume control, and share functionality
- **Keyboard Shortcuts** - Space to play/pause, arrow keys for volume
- **Multiple Sections** - About, schedule, location, and support sections
- **Smooth Animations** - Scroll-triggered animations and transitions

## 🚀 Quick Start

1. **Open the app**
   Simply open `index.html` in your web browser

2. **Or use a local server** (recommended)
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Visit the app**
   Open your browser and go to `http://localhost:8000`

## 🎵 Changing the Livestream

To use a different YouTube livestream:

1. Open `script.js`
2. Find the line with `YOUTUBE_VIDEO_ID`
3. Replace the video ID with your desired YouTube video/livestream ID

```javascript
// Example: Replace 'jfKfPfyJRdk' with your YouTube video ID
const YOUTUBE_VIDEO_ID = 'your-video-id-here';
```

### How to get a YouTube Video ID:

From a URL like `https://www.youtube.com/watch?v=jfKfPfyJRdk`
The video ID is: `jfKfPfyJRdk` (everything after `v=`)

## 📁 Project Structure

```
aura/
│
├── index.html          # Main HTML file
├── styles.css          # Styling and animations
├── script.js           # JavaScript functionality
└── README.md           # Documentation
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #ec4899;
    /* ... more colors */
}
```

### Content
Edit text content directly in `index.html`:
- Station name and description
- Schedule information
- Location details
- Support options

### Features

#### Interactive Player Controls
- Play/Pause button
- Volume slider
- Now playing information
- Full-screen YouTube player

#### Keyboard Shortcuts
- `Space` - Play/Pause
- `Arrow Up` - Increase volume
- `Arrow Down` - Decrease volume

#### Mobile Features
- Responsive hamburger menu
- Touch-friendly controls
- Optimized layout for small screens

## 🌟 Popular 24/7 YouTube Livestreams

Here are some popular livestreams you can use:

1. **Lofi Girl** - `jfKfPfyJRdk` (Default)
2. **ChilledCow** - Various lofi streams
3. **Chillhop Music** - `5yx6BWlEVcY`
4. **Jazz Cafe** - `Dx5qFachd3A`

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **JavaScript (ES6+)** - Interactive functionality
- **YouTube IFrame API** - Video player integration
- **Google Fonts** - Space Grotesk font family

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Features Breakdown

### Hero Section
- Live status badge with pulsing animation
- Embedded YouTube player
- Custom control interface
- Share functionality

### About Section
- Station information
- Call-to-action buttons
- Responsive layout

### Features Grid
- Highlighted station features
- Icon-based cards
- Hover animations

### Schedule Section
- Weekly programming schedule
- Show proposal CTA
- Grid layout

### Location Section
- Physical location information
- Hours and amenities
- Map placeholder

### Support Section
- Donation options
- Subscription tiers
- Shop integration

## 🔧 Development

No build process required! This is a pure HTML/CSS/JS application.

For development with auto-reload, you can use:
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (VS Code extension)
- [Browser Sync](https://browsersync.io/)

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to fork this project and customize it for your own radio station or streaming service!

## 💡 Tips

- Use high-quality YouTube streams for best experience
- Test on multiple devices for responsive design
- Customize colors to match your brand
- Add your own logo by editing the `.logo` class in CSS
- Update social media links in the footer

## 🐛 Troubleshooting

**Player not loading?**
- Check your internet connection
- Verify the YouTube video ID is correct
- Make sure the video is not restricted in your region

**Controls not working?**
- Wait for the player to fully load
- Check browser console for errors
- Ensure JavaScript is enabled

**Mobile menu not showing?**
- Clear browser cache
- Check for JavaScript errors
- Try a different browser

---

**Built with ❤️ for music lovers everywhere**

Enjoy your streaming experience! 🎵

