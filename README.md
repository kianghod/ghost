# Ghost Tube - Spooky Video Collection

A hauntingly beautiful web application for managing your favorite spooky and paranormal YouTube videos with ratings, categories, and locations.

## Features

### 👻 Add Spooky Videos
- **Modal Form**: Eerie, user-friendly modal for adding new spooky videos
- **Required Fields**: Name, YouTube URL, Rating (1-10 scale), Category
- **Optional Fields**: Location (e.g., Haunted House, Dark Room, etc.)
- **URL Validation**: Automatically validates YouTube URLs
- **Rating Slider**: Interactive slider for rating selection

### 🎨 Two View Modes
- **Card View**: Beautiful grid layout with thumbnails
- **List View**: Compact list format for easy scanning
- **Toggle**: Switch between views with dedicated buttons

### 🔍 Search & Filter
- **Search**: Find links by name or location
- **Category Filter**: Filter by specific categories
- **Real-time**: Instant search and filter results

### 📱 Responsive Design
- **Mobile-friendly**: Works perfectly on all devices
- **Modern UI**: Glassmorphism design with smooth animations
- **Accessible**: Keyboard navigation and screen reader friendly

## Categories Available
- Ghost Sightings
- Paranormal Investigations
- Haunted Places
- Urban Legends
- Horror Stories
- Supernatural
- Cryptids
- Other

## How to Use

### Adding a New Spooky Video
1. Click the "Add Spooky Video" button
2. Fill in the required fields:
   - **Name**: Give your spooky video a descriptive name
   - **YouTube Link**: Paste any YouTube URL (watch, youtu.be, or embed)
   - **Rating**: Use the slider to rate from 1-10
   - **Category**: Select from the dropdown menu
   - **Location**: Optional - add where you watch this spooky content
3. Click "Save" to add the video

### Managing Spooky Videos
- **Watch**: Click the "Watch" button to open the spooky video in a new tab
- **Edit**: Click "Edit" to modify video details
- **Delete**: Click "Delete" to remove a video (with confirmation)

### Switching Views
- Use the "Cards" and "List" buttons in the header to switch between view modes
- Cards show thumbnails and are great for visual browsing
- List view is compact and shows more details at once

### Searching and Filtering
- Use the search box to find spooky videos by name or location
- Use the category dropdown to filter by specific categories
- Both search and filter work together

## Technical Details

### Storage
- All spooky video data is stored locally in your browser using localStorage
- No server required - everything works offline
- Data persists between browser sessions

### Browser Support
- Modern browsers with ES6 support
- Chrome, Firefox, Safari, Edge
- Mobile browsers supported

### File Structure
```
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Getting Started

1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start adding your favorite spooky videos!

## Features in Detail

### YouTube URL Support
The app accepts various YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### Rating System
- 1-10 scale with visual star representation
- Interactive slider in the form
- Stars display in both card and list views

### Thumbnail Display
- Automatically fetches YouTube video thumbnails
- Fallback handling for missing thumbnails
- Hover effects with play button overlay

### Data Management
- Add, edit, and delete spooky videos
- Automatic saving to localStorage
- Sample spooky data included for first-time users

## Customization

You can easily customize the app by modifying the CSS variables or adding new categories in the JavaScript file.

## License

This project is open source and available under the MIT License. 