import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Markdown from 'react-markdown';

import { POSTS } from '../data/posts';
import useMeta from '../hooks/useMeta';

function useScrollDepth(post) {
  const bodyRef = useRef(null);
  const firedRef = useRef(new Set());

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    firedRef.current = new Set();

    const thresholds = [0.25, 0.5, 0.75, 1.0];

    function handleScroll() {
      const rect = el.getBoundingClientRect();
      const elTop = window.scrollY + rect.top;
      const elHeight = rect.height;
      const scrollPos = window.scrollY + window.innerHeight;
      const progress = Math.min((scrollPos - elTop) / elHeight, 1);

      for (const t of thresholds) {
        if (progress >= t && !firedRef.current.has(t)) {
          firedRef.current.add(t);
          ReactGA.event('scroll_depth', {
            depth: `${Math.round(t * 100)}%`,
            post_title: post.title,
            post_slug: post.slug,
          });
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  return bodyRef;
}

function useReadingTime(post) {
  const secondsRef = useRef(0);
  const activeRef = useRef(true);

  const sendTime = useCallback(() => {
    if (secondsRef.current > 0) {
      ReactGA.event('post_read_time', {
        seconds: secondsRef.current,
        post_title: post.title,
        post_slug: post.slug,
      });
    }
  }, [post]);

  useEffect(() => {
    secondsRef.current = 0;
    activeRef.current = true;

    const interval = setInterval(() => {
      if (activeRef.current) secondsRef.current += 1;
    }, 1000);

    function handleVisibility() {
      activeRef.current = document.visibilityState === 'visible';
    }

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      sendTime();
    };
  }, [post, sendTime]);
}

function useReadingProgress(bodyRef, barRef) {
  useEffect(() => {
    let rafId = null;

    function update() {
      const el = bodyRef.current;
      const bar = barRef.current;
      if (!el || !bar) return;
      const rect = el.getBoundingClientRect();
      const elTop = window.scrollY + rect.top;
      const elHeight = rect.height;
      const scrolled = window.scrollY + window.innerHeight - elTop;
      const progress = Math.min(Math.max(scrolled / elHeight, 0), 1);
      bar.style.transform = `scaleX(${progress})`;
    }

    function handleScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        update();
        rafId = null;
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [bodyRef, barRef]);
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function ShareButtons({ post }) {
  const [copied, setCopied] = useState(false);

  function trackShare(method) {
    ReactGA.event('share', {
      method,
      post_title: post.title,
      post_slug: post.slug,
      post_type: post.type,
      post_tags: post.tags.join(', '),
      content_url: `${window.location.origin}/posts/${post.slug}`,
    });
  }

  function copyLink() {
    const url = `${window.location.origin}/posts/${post.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      trackShare('copy_link');
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareOnX() {
    const url = `${window.location.origin}/posts/${post.slug}`;
    const text = `${post.title} — Musing`;
    trackShare('share_x');
    window.open(
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <div className="share-buttons">
      <button className="btn btn--outline" onClick={copyLink}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <button className="btn btn--outline" onClick={shareOnX}>
        Share on X
      </button>
    </div>
  );
}

function RelatedPosts({ currentPost }) {
  const related = POSTS
    .filter(p => p.slug !== currentPost.slug)
    .map(p => ({
      ...p,
      sharedTags: p.tags.filter(t => currentPost.tags.includes(t)).length,
    }))
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, 2);

  if (related.length === 0) return null;

  return (
    <section className="related-posts">
      <h2>keep reading</h2>
      <div className="posts-grid">
        {related.map(post => (
          <Link key={post.slug} className="post-card" to={`/posts/${post.slug}`}>
            <div className="post-card-meta">
              <span className="post-card-date">{formatDate(post.date)}</span>
              <span className="post-card-time">{post.time}</span>
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
        ))}
      </div>
    </section>
  );
}

export default function Post() {
  const { slug } = useParams();
  const post = POSTS.find(p => p.slug === slug);

  const bodyRef = useScrollDepth(post || { title: '', slug: '' });
  useReadingTime(post || { title: '', slug: '' });
  const progressBarRef = useRef(null);
  useReadingProgress(bodyRef, progressBarRef);

  useMeta(post ? {
    title: post.title,
    description: post.description,
    type: 'article',
    article: {
      title: post.title,
      date: post.date,
      readingTime: post.readingTime,
      tags: post.tags,
    },
  } : {});

  if (!post) return <Navigate to="/posts" replace />;

  return (
    <>
      <div ref={progressBarRef} className="reading-progress" style={{ transform: 'scaleX(0)' }} />
      <article className="post-article">
        <div className="container">
          <header className="post-article-header">
            <h1>{post.title}</h1>
            <div className="post-article-meta">
              <span>{post.displayDate}</span>
              <span>&middot;</span>
              <span>{post.time}</span>
              <span>&middot;</span>
              <span>{post.readingTime} min read</span>
              <span>&middot;</span>
              <span className="post-card-type">{post.type}</span>
            </div>
            <div className="post-article-tags">
              {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
          </header>

          <div ref={bodyRef} className="post-article-body">
            <Markdown>{post.content}</Markdown>
          </div>

          <ShareButtons post={post} />

          <RelatedPosts currentPost={post} />
        </div>
      </article>
    </>
  );
}
