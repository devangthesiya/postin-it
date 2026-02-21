import { useState } from 'react';
import { Link } from 'react-router-dom';
import { POSTS } from '../data/posts';

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function PostCard({ post }) {
  return (
    <Link className="post-card" to={`/posts/${post.slug}`}>
      <div className="post-card-meta">
        <span className="post-card-date">{formatDate(post.date)}</span>
        <span className="post-card-reading-time">{post.readingTime} min</span>
        <span className="post-card-type">{post.type}</span>
      </div>
      <div className="post-card-content">
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        <div className="post-card-tags">
          {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
    </Link>
  );
}

export default function Posts() {
  const sortedPosts = [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));
  const allTags = [...new Set(sortedPosts.flatMap(p => p.tags))].sort();
  const [activeTag, setActiveTag] = useState('all');

  const filtered = activeTag === 'all'
    ? sortedPosts
    : sortedPosts.filter(p => p.tags.includes(activeTag));

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
