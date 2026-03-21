import { useState } from 'react';
import { Link } from 'react-router-dom';
import { POSTS } from '../data/posts';
import useMeta from '../hooks/useMeta';

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function PostCard({ post }) {
  return (
    <Link className="post-card" to={`/posts/${post.slug}`}>
      <div className="post-card-meta">
        <span className="post-card-date">{formatDate(post.date)}</span>
        <span className="post-card-time">{post.time}</span>
        <span className="post-card-reading-time">{post.readingTime} min</span>
        <span className="post-card-type">{post.type}</span>
      </div>
      <div className="post-card-content">
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <div className="post-card-tags">
          {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
    </Link>
  );
}

export default function Posts() {
  useMeta({ title: 'Posts', description: 'All posts — essays, short notes, and everything in between.' });

  const sortedPosts = [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
  const allTags = [...new Set(sortedPosts.flatMap(p => p.tags))].sort();
  const [activeTag, setActiveTag] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = sortedPosts.filter(post => {
    const matchesTag = activeTag === 'all' || post.tags.includes(activeTag);
    if (!query.trim()) return matchesTag;
    const q = query.toLowerCase();
    const matchesQuery =
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.tags.join(' ').toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>posts</h1>
          <p>everything i've written &mdash; filter by tag or just scroll through</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <input
            type="text"
            className="search-input"
            placeholder="Search posts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          <div className="tags-filter">
            <button
              className={`tag${activeTag === 'all' ? ' active' : ''}`}
              onClick={() => setActiveTag('all')}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag${activeTag === tag ? ' active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="posts-grid">
            {filtered.length === 0 ? (
              <div className="empty-state"><p>No posts match that filter.</p></div>
            ) : (
              filtered.map(post => <PostCard key={post.slug} post={post} />)
            )}
          </div>
        </div>
      </section>
    </>
  );
}
