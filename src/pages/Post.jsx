import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useRef, useCallback } from 'react';
import ReactGA from 'react-ga4';
import { POSTS } from '../data/posts';

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

export default function Post() {
  const { slug } = useParams();
  const post = POSTS.find(p => p.slug === slug);

  const bodyRef = useScrollDepth(post || { title: '', slug: '' });
  useReadingTime(post || { title: '', slug: '' });

  if (!post) return <Navigate to="/posts" replace />;

  return (
    <article className="post-article">
      <div className="container">
        <header className="post-article-header">
          <h1>{post.title}</h1>
          <div className="post-article-meta">
            <span>{post.displayDate}</span>
            <span>&middot;</span>
            <span>{post.readingTime} min read</span>
            <span>&middot;</span>
            <span className="post-card-type">{post.type}</span>
          </div>
          <div className="post-article-tags">
            {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        </header>

        <div
          ref={bodyRef}
          className="post-article-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
