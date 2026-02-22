import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://postin-it.vercel.app';

export default function useMeta({ title, description, type } = {}) {
  const location = useLocation();

  useEffect(() => {
    const suffix = ' — Musing';
    document.title = title ? title + suffix : 'Musing';

    const desc = description || 'A personal space for essays, short notes, and everything in between.';
    const ogType = type || 'website';
    const canonicalUrl = SITE_URL + location.pathname;

    function setMeta(attr, key, content) {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (el) {
        el.setAttribute('content', content);
      } else {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        el.setAttribute('content', content);
        document.head.appendChild(el);
      }
    }

    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', title || 'Musing');
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:url', canonicalUrl);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [title, description, type, location.pathname]);
}
