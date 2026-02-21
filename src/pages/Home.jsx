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

export default function Home() {
  const latestPosts = [...POSTS]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="sticker sticker--sun">
          <img src="/assets/images/sticker-sun.png" alt="" aria-hidden="true" />
        </div>
        <div className="sticker sticker--star">
          <img src="/assets/images/sticker-star.png" alt="" aria-hidden="true" />
        </div>
        <div className="sticker sticker--memo">
          <img src="/assets/images/sticker-memo.png" alt="" aria-hidden="true" />
        </div>
        <div className="sticker sticker--coffee">
          <img src="/assets/images/sticker-coffee.png" alt="" aria-hidden="true" />
        </div>

        <div className="container container--wide">
          <h1>i write things down<br />so i <span className="highlight">don't forget.</span></h1>
          <p className="hero-subtitle">essays, short notes, and everything in between</p>
          <a href="#latest" className="hero-scroll">
            scroll
            <svg viewBox="0 0 24 24"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </a>
        </div>
      </section>

      <section className="section" id="latest">
        <div className="container">
          <div className="section-header">
            <h2>latest posts</h2>
            <Link to="/posts">View all &rarr;</Link>
          </div>
          <div className="posts-grid">
            {latestPosts.map(post => <PostCard key={post.slug} post={post} />)}
          </div>
        </div>
      </section>
    </>
  );
}
