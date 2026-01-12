# Personal Blog

A simple, fast, and modern personal blog built with static site generation and deployed to Netlify.

## Tech Stack

- [11ty](https://www.11ty.dev/) (Eleventy) - Static site generator
- [Nunjucks](https://mozilla.github.io/nunjucks/) - Templating engine
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Netlify](https://www.netlify.com/) - Hosting and deployment
- [Netlify CMS](https://www.netlifycms.org/) - Content management system

## Getting Started

### Prerequisites

- Node.js (version 14 or higher recommended)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development

Start the development server with hot reloading:
```bash
npm start
```

This runs both the Eleventy server and CSS watcher in parallel. The site will be available at `http://localhost:8080`.

### Build

Generate a production build:
```bash
npm run build
```

This compiles the site to the `_site` directory with optimized CSS.

## Available Scripts

- `npm start` - Start development server with CSS watching
- `npm run build` - Build for production
- `npm run build:css` - Compile and optimize CSS
- `npm run serve` - Serve the site with Eleventy
- `npm run watch` - Watch CSS files for changes

## Deployment

The site is automatically deployed to Netlify on push to the main branch. Netlify handles the build process using the `npm run build` command.
