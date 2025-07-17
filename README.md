# Parafia Prawosławna Św. Mikołaja w Toruniu - Website

A multilingual website for the Orthodox Parish of St. Nicholas in Toruń, Poland. The website supports Polish, English, Ukrainian, and Russian languages.

## Features

- **Multilingual Support**: Polish, English, Ukrainian, and Russian
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Design**: Clean, elegant layout with warm colors reflecting the church's architecture
- **Static Site**: Perfect for GitHub Pages hosting
- **Orthodox Church Elements**: Color scheme inspired by the light blue exterior and golden cupola

## Sections

1. **Home**: Hero section with main church information
2. **About Us**: Detailed history of the parish from 1668 to present
3. **Services**: Worship schedule and service times
4. **Contact**: Parish priest contact information and church address
5. **News**: Latest announcements and important events

## Setup for GitHub Pages

### Option 1: Using GitHub Web Interface

1. Create a new repository on GitHub
2. Upload all files (`index.html`, `styles.css`, `script.js`) to the repository
3. Go to repository Settings > Pages
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Your website will be available at `https://yourusername.github.io/repository-name`

### Option 2: Using Git Command Line

1. Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit: Orthodox church website"
```

2. Create repository on GitHub and add remote:
```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

3. Enable GitHub Pages in repository settings as described above

## File Structure

```
church_san_nicola/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## Color Scheme

The website uses a color palette inspired by the church's architecture:
- **Primary Blue**: `#87CEEB` (Light blue exterior)
- **Gold**: `#FFD700` (Golden cupola)
- **Warm tones**: Cream and light grays for warmth
- **Dark Blue**: `#4682B4` for text and accents

## Customization

### Adding Images

Replace the placeholder divs with actual images:

1. Add image files to your repository
2. Replace placeholder divs like:
```html
<div class="hero-image-placeholder">
    <div class="placeholder-text">Church Photo Placeholder</div>
</div>
```

With:
```html
<img src="path/to/your/image.jpg" alt="Church Photo" class="hero-image">
```

### Updating Content

- Edit the `translations` object in `script.js` to modify text content
- Add new languages by extending the translations object
- Update parish information in the HTML file

### Styling Changes

- Modify CSS variables in `:root` to change colors
- Adjust layouts in the CSS file
- Add new sections by following the existing pattern

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This website is created for the Orthodox Parish of St. Nicholas in Toruń. Please contact the parish for usage permissions.

## Contact

For technical support or website updates, please contact the parish at:
- Email: kshajduczenia@tlen.pl
- Phone: 606 910 655