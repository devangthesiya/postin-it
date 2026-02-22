# Musing

A minimal personal site for essays, short notes, and everything in between. Built with React + Vite, deployed on Vercel.

**Live:** [postin-it.vercel.app](https://postin-it.vercel.app)

## Stack

- React + Vite
- React Router (client-side routing)
- Vanilla CSS (custom design system with dark/light themes)
- Google Analytics 4 + Vercel Analytics

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```
src/
├── components/    # Layout, Header, Footer
├── pages/         # Home, Posts, Post, About, Contact, Bookmarks
├── data/          # Posts and bookmarks data
├── main.jsx       # Entry point
├── App.jsx        # Router + analytics
└── main.css       # All styles
```

## Adding a New Post

Add a new entry to the top of the `POSTS` array in `src/data/posts.js`:

```js
{
  title: "Your Post Title",
  slug: "your-post-title",
  date: "2026-03-01",
  displayDate: "March 1, 2026",
  description: "A short summary for the card.",
  tags: ["tag1", "tag2"],
  type: "essay",
  readingTime: 5,
  content: `<p>Your HTML content here.</p>`
}
```

That's it — the home page and posts page pick it up automatically.

## Deploy

Connected to Vercel. Pushes to `main` trigger automatic deployments.
