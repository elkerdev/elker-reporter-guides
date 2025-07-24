# Elker Reporter Guides

This repository contains user guides specifically for reporters using the Elker platform. These guides are designed to help anonymous reporters navigate the reporting process.

## Available Guides

- **Submitting a Report** - Step-by-step instructions for submitting an anonymous report, using the secure chat feature, and logging back in to check updates

## Deployment

This site is designed to be deployed via GitHub Pages or any static hosting service. The guides are self-contained HTML files with shared CSS styling.

## Access Control

These guides are intended only for reporters. Partner and manager guides are hosted in separate repositories to maintain proper access control.

## Adding New Guides

1. Export your guide from Scribe as HTML
2. Add the CSS and navigation script references:
   ```html
   <link rel="stylesheet" href="styles.css">
   <script src="navigation.js"></script>
   ```
3. Update the index.html to include a link to your new guide

## Technical Details

- Pure HTML/CSS/JS implementation
- Dynamic in-page navigation based on document headings
- Responsive design with Elker branding
- No server-side dependencies