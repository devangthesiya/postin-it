# Musing — Codebase Reference & Usage Guide

> This document is written for LLM assistants or developers who need to understand how this project works, how files connect, and how to make changes — especially adding new posts.

---

## Overview

**Musing** is a minimal personal website for publishing write-ups. It uses **zero dependencies** — pure HTML, CSS, and vanilla JavaScript. There are no build tools, no frameworks, no package managers. Content (posts, bookmarks) is hard-coded directly into the codebase.

The site must be served from a local or remote HTTP server (not opened as a raw file) because it uses `fetch()` to inject shared header/footer components.

To run locally:
```bash
cd post-it
python3 -m http.server 8080
# Then open http://localhost:8080
```

---

## Directory Structure

```
post-it/
├── index.html                          # Home page — hero + latest 3 posts
├── posts.html                          # All posts listing with tag filtering
├── about.html                          # About page
├── contact.html                        # Contact — social link cards
├── bookmarks.html                      # Curated links, categorized
│
├── styles/
│   └── main.css                        # ALL styles — design tokens, components, responsive, dark/light
│
├── scripts/
│   └── main.js                         # ALL JS — theme toggle, component injection, post rendering, bookmarks
│
├── components/
│   ├── header.html                     # Shared header (nav bar, logo, dark mode toggle, hamburger)
│   └── footer.html                     # Shared footer (copyright, nav links)
│
├── data/
│   ├── posts.js                        # Post metadata registry — JS array called POSTS
│   └── bookmarks.js                    # Bookmarks data — JS array called BOOKMARKS
│
├── posts/
│   └── YYYY/                           # Year folder
│       └── MM/                         # Month folder (zero-padded)
│           └── slug-title.html         # Individual post HTML file
│
├── assets/
│   ├── favicon.svg                     # Site favicon (SVG)
│   └── images/                         # Any images used in posts or site pages
│
├── TODO.md                             # Task tracker
└── USAGE.md                            # This file
```

---

## How Things Connect

### Page Loading Flow

Every page follows this pattern:

1. HTML file loads `styles/main.css` for styling.
2. HTML file optionally loads a data script (`data/posts.js` or `data/bookmarks.js`) that defines a global array.
3. HTML file has `<div id="header-placeholder"></div>` and `<div id="footer-placeholder"></div>` — empty divs.
4. HTML file loads `scripts/main.js` at the bottom.
5. `main.js` runs:
   - Applies saved theme (dark/light) from `localStorage` immediately.
   - Fetches `components/header.html` and `components/footer.html` via `fetch()` and injects them into the placeholder divs.
   - Rewrites links in components if the page is nested (using `path-depth` meta tag).
   - Sets up theme toggle buttons, hamburger menu, and active nav highlighting.
   - Runs page-specific logic: renders post cards (home/posts page) or bookmark cards (bookmarks page).

### The `path-depth` Meta Tag

This is **critical** for nested pages (posts). Every HTML page has:
```html
<meta name="path-depth" content="N">
```

- Root-level pages (`index.html`, `posts.html`, etc.): `content="0"`
- Posts at `posts/2026/02/my-post.html`: `content="3"` (3 directories deep)

`main.js` reads this value and prefixes all component/data/asset paths with the correct number of `../` segments. This is how shared components, styles, and scripts work from any folder depth.

**Rule:** If you create a post at a different depth, update path-depth accordingly. Count the number of directories between the file and the project root.

### Data-Driven Rendering

The site avoids duplicating post/bookmark info. Data is defined **once** in JS files and rendered dynamically:

- **`data/posts.js`** defines `const POSTS = [...]` — the home page shows the latest 3, the posts page shows all with tag filtering.
- **`data/bookmarks.js`** defines `const BOOKMARKS = [...]` — the bookmarks page renders all categories and items.

The actual post HTML files contain the **full article body** only. The listing cards (title, description, tags, date) are generated from the `POSTS` array by `main.js`.

---

## How to Add a New Post

This is a **2-step process**: create the HTML file, then register it in the metadata.

### Step 1: Create the Post HTML File

Create a new file at `posts/YYYY/MM/slug-title.html`. Use kebab-case for the filename.

Use this exact template (copy and fill in):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="path-depth" content="3">
  <meta name="description" content="SHORT_DESCRIPTION">
  <meta property="og:title" content="POST_TITLE">
  <meta property="og:description" content="SHORT_DESCRIPTION">
  <meta property="og:type" content="article">
  <title>POST_TITLE — Musing</title>
  <link rel="icon" href="../../../assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../../../styles/main.css">
</head>
<body>

  <div id="header-placeholder"></div>

  <main>
    <article class="post-article">
      <div class="container">

        <!-- Post Header -->
        <header class="post-article-header">
          <h1>POST_TITLE</h1>
          <div class="post-article-meta">
            <span>MONTH DAY, YEAR</span>
            <span>&middot;</span>
            <span>N min read</span>
            <span>&middot;</span>
            <span class="post-card-type">TYPE</span>
          </div>
          <div class="post-article-tags">
            <span class="tag">tag1</span>
            <span class="tag">tag2</span>
          </div>
        </header>

        <!-- Post Body -->
        <div class="post-article-body">

          <!-- YOUR CONTENT GOES HERE -->
          <!-- Available elements: <p>, <h2>, <h3>, <ul>/<ol>/<li>, <blockquote>, <pre><code>, <a>, <strong>, <em>, <img>, <hr> -->

        </div>

      </div>
    </article>
  </main>

  <div id="footer-placeholder"></div>

  <script src="../../../scripts/main.js"></script>
</body>
</html>
```

**Replace these placeholders:**
- `POST_TITLE` — the title of the post (appears in 3 places: og:title, `<title>`, and `<h1>`)
- `SHORT_DESCRIPTION` — 1-2 sentence summary (appears in meta description and og:description)
- `MONTH DAY, YEAR` — human-readable date, e.g. "February 14, 2026"
- `N min read` — estimated reading time in minutes
- `TYPE` — one of: `essay`, `short`, `mixed`
- Tags — add/remove `<span class="tag">tagname</span>` as needed

### Step 2: Register in `data/posts.js`

Add a new object to the `POSTS` array at the **top** (newest first):

```javascript
const POSTS = [
  {
    title: "Your New Post Title",
    date: "2026-03-15",           // YYYY-MM-DD format
    description: "A short summary that appears on the post card.",
    tags: ["tag1", "tag2"],       // Array of lowercase tag strings
    path: "posts/2026/03/your-new-post-title.html",  // Relative from root
    type: "essay",                // "essay" | "short" | "mixed"
    readingTime: 5                // Estimated minutes (integer)
  },
  // ... existing posts below
];
```

**That's it.** The home page and posts page will automatically pick up the new post.

### Post Metadata Schema

| Field         | Type       | Required | Description                                        |
|---------------|------------|----------|----------------------------------------------------|
| `title`       | `string`   | Yes      | Post title, displayed on cards and the post page   |
| `date`        | `string`   | Yes      | ISO date `YYYY-MM-DD`, used for sorting            |
| `description` | `string`   | Yes      | 1-2 sentence summary for the card and meta tags    |
| `tags`        | `string[]` | Yes      | Lowercase tag strings, used for filtering           |
| `path`        | `string`   | Yes      | Relative path from project root to the HTML file   |
| `type`        | `string`   | Yes      | One of `"essay"`, `"short"`, `"mixed"`             |
| `readingTime` | `number`   | Yes      | Estimated reading time in minutes                  |

---

## How to Add a New Bookmark

Edit `data/bookmarks.js`. The structure is an array of category objects.

**To add an item to an existing category:**
```javascript
{
  category: "Reads",
  items: [
    // Add your new item here
    {
      title: "Site Name",
      url: "https://example.com",
      description: "Why this link is worth visiting."
    },
    // ... existing items
  ]
}
```

**To add a new category**, add a new object to the `BOOKMARKS` array:
```javascript
{
  category: "New Category Name",
  items: [
    {
      title: "First Link",
      url: "https://example.com",
      description: "Description of the link."
    }
  ]
}
```

### Bookmark Item Schema

| Field         | Type     | Required | Description                                 |
|---------------|----------|----------|---------------------------------------------|
| `title`       | `string` | Yes      | Display name of the bookmark                |
| `url`         | `string` | Yes      | Full URL (must be valid, used for hostname) |
| `description` | `string` | Yes      | Short description shown on the card         |

---

## Styling Reference

All styles live in `styles/main.css`. Key things to know:

### Design Tokens (CSS Custom Properties)

All colors, fonts, spacing, etc. are defined as CSS variables on `:root`. There are two complete sets:

- **Light theme**: `:root, [data-theme="light"] { ... }`
- **Dark theme**: `[data-theme="dark"] { ... }`

Key variables:
- `--color-bg`, `--color-surface`, `--color-text`, `--color-accent` — core palette
- `--font-display` (Playfair Display) — editorial serif for large headings and display text
- `--font-heading` (Bricolage Grotesque) — bold sans for nav, labels, tags, buttons, meta text
- `--font-body` (Inter) — clean sans-serif for long-form body text
- `--text-xs` through `--text-hero` — font scale (goes up to 7rem for hero)
- `--space-xs` through `--space-5xl` — spacing scale
- `--radius-sm/md/lg/full` — border radius
- `--transition-fast/base/slow` — animation speeds

### Key CSS Classes for Post Content

Inside `.post-article-body`, standard HTML elements are already styled:
- `<p>` — body text, proper margins
- `<h2>`, `<h3>` — section headings with top/bottom margins
- `<ul>`, `<ol>` — lists with proper indentation
- `<blockquote>` — left accent border, italic
- `<pre><code>` — code blocks with background, border, monospace font
- `<code>` (inline) — inline code with background pill
- `<a>` — accent-colored with underline
- `<img>` — rounded corners, vertical margin
- `<hr>` — subtle divider line
- `<strong>`, `<em>` — bold/italic

No special classes are needed inside post bodies — just write semantic HTML.

### Available UI Component Classes

- `.btn .btn--primary` — filled accent pill button
- `.btn .btn--outline` — bordered pill button
- `.tag` — small uppercase pill tag (Bricolage Grotesque)
- `.post-card` — magazine-style post row (date sidebar + content)
- `.contact-card` — text-based contact link (no icons, editorial serif heading)
- `.bookmark-card` — borderless text link with indent-on-hover
- `.container` — centered content (760px max)
- `.container--wide` — wider content (1200px max)
- `.section` — vertical padded section
- `.page-header` — oversized italic Playfair heading + uppercase Bricolage subtitle
- `.sticker` — floating decorative SVG element with CSS animation (hero only)
- `.theme-toggle-text` — text-based DARK/LIGHT toggle button

---

## Theme System

### How Dark/Light Mode Works

1. On page load, `main.js` checks `localStorage` for a saved `"theme"` key.
2. If none exists, it reads the OS preference via `window.matchMedia('(prefers-color-scheme: dark)')`.
3. It sets `data-theme="dark"` or `data-theme="light"` on the `<html>` element.
4. CSS uses `[data-theme="dark"]` and `[data-theme="light"]` selectors to swap all color variables.
5. Clicking the text-based toggle (shows "DARK" in light mode, "LIGHT" in dark mode) flips the theme and saves to `localStorage`. The toggle label updates via `updateThemeToggleLabels()`.

The theme is applied **before DOM rendering** (the JS runs synchronously at the top of `main.js`), so there's no flash of wrong theme.

---

## Shared Components

### Header (`components/header.html`)
Contains:
- Logo linking to home (`/`)
- Desktop nav links (`.nav-links`)
- Theme toggle button (sun/moon SVG icons)
- Mobile hamburger wrapper (`.hamburger-wrapper`) — visible only below 768px
- Mobile nav overlay (`.mobile-nav`) — full-screen nav for mobile

### Footer (`components/footer.html`)
Contains:
- Copyright text
- Duplicate nav links for footer navigation

### How Injection Works
`main.js` looks for `#header-placeholder` and `#footer-placeholder` divs, fetches the corresponding HTML files from `components/`, and injects the HTML. For nested pages, it rewrites all `href="/"` prefixed links to use the correct relative path based on `path-depth`.

**Important:** If you add a new top-level page and want it in the navigation, update **both** `components/header.html` (desktop nav, mobile nav) and `components/footer.html`.

---

## Pages Reference

| File              | Data Script Required | Purpose                            |
|-------------------|---------------------|------------------------------------|
| `index.html`      | `data/posts.js`     | Home — hero section + latest posts |
| `posts.html`      | `data/posts.js`     | All posts with tag filter bar      |
| `about.html`      | None                | Static about page                  |
| `contact.html`    | None                | Static contact link cards          |
| `bookmarks.html`  | `data/bookmarks.js` | Rendered bookmark categories       |

Pages that need dynamic data include a `<script src="data/....js"></script>` tag in the `<head>` (before `main.js` loads). This makes the global `POSTS` or `BOOKMARKS` array available when `main.js` initializes.

---

## Common Tasks Quick Reference

| Task                          | What to do                                                                 |
|-------------------------------|----------------------------------------------------------------------------|
| **Add a new post**            | Create HTML in `posts/YYYY/MM/`, add entry to `data/posts.js`             |
| **Add a bookmark**            | Add item object to a category in `data/bookmarks.js`                      |
| **Change site colors**        | Edit CSS variables in `:root` and `[data-theme="dark"]` in `main.css`     |
| **Edit nav links**            | Update `components/header.html` (desktop + mobile) and `components/footer.html` |
| **Change hero text**          | Edit the `<section class="hero">` in `index.html`                         |
| **Update about page content** | Edit the `<div class="about-content">` in `about.html`                    |
| **Update contact links**      | Edit the `<a class="contact-card">` blocks in `contact.html`              |
| **Change fonts**              | Update the Google Fonts `@import` in `main.css` and the `--font-*` vars   |
| **Add a new page**            | Create HTML file at root, add nav links in header/footer components        |
| **Change site name**          | Update logo in `components/header.html`, footer in `footer.html`, titles   |

---

## Gotchas & Important Notes

1. **Must use an HTTP server** — opening HTML files directly (`file://`) will break `fetch()` for components. Use `python3 -m http.server` or any static server.

2. **`path-depth` must be correct** — if a post is at `posts/2026/02/file.html`, depth is `3`. Wrong depth = broken styles, scripts, and nav links.

3. **All relative paths in post files use `../../../`** — because posts are 3 levels deep. If you ever change the folder structure depth, update the paths in the template.

4. **Posts are sorted newest-first automatically** — `main.js` sorts by the `date` field. Just make sure dates are in `YYYY-MM-DD` format.

5. **Tags are case-sensitive** — `"Personal"` and `"personal"` would be treated as different tags. Keep all tags lowercase.

6. **The `POSTS` and `BOOKMARKS` arrays are global variables** — they're loaded via `<script>` tags before `main.js` runs. Don't wrap them in modules or change the variable names.

7. **No build step** — changes are live immediately on refresh. Just edit and reload.
