import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://postin-it.vercel.app';
const DEFAULT_IMAGE = SITE_URL + '/assets/og-image.png';

export default function useMeta({ title, description, type, article } = {}) {
  const location = useLocation();

  useEffect(() => {
    const suffix = ' — Musing';
    document.title = title ? title + suffix : 'Musing';

    const desc = description || 'A personal space for essays, short notes, and everything in between.';
    const ogType = type || 'website';
    const canonicalUrl = SITE_URL + location.pathname;
    const pageTitle = title || 'Musing';

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
    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', DEFAULT_IMAGE);
    setMeta('property', 'og:site_name', 'Musing');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', DEFAULT_IMAGE);
    setMeta('name', 'twitter:site', '@devangthesiya');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    let jsonLdScript = document.querySelector('script[data-meta="jsonld"]');
    if (article) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: desc,
        url: canonicalUrl,
        datePublished: article.date,
        author: {
          '@type': 'Person',
          name: 'Devang Thesiya',
          url: SITE_URL + '/about',
        },
        publisher: {
          '@type': 'Person',
          name: 'Devang Thesiya',
        },
        image: DEFAULT_IMAGE,
        mainEntityOfPage: canonicalUrl,
        wordCount: article.wordCount || undefined,
        timeRequired: article.readingTime ? `PT${article.readingTime}M` : undefined,
        keywords: article.tags ? article.tags.join(', ') : undefined,
      };

      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.setAttribute('type', 'application/ld+json');
        jsonLdScript.setAttribute('data-meta', 'jsonld');
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }

    return () => {
      const existing = document.querySelector('script[data-meta="jsonld"]');
      if (existing) existing.remove();
    };
  }, [title, description, type, article, location.pathname]);
}
