/**
 * Musing — Main JavaScript
 * --------------------------
 * Handles: theme toggle, header/footer injection, hamburger menu,
 * post listing, bookmarks rendering, and active nav highlighting.
 */

(function () {
  'use strict';

  /* ========================================
     THEME MANAGEMENT
     ======================================== */

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  setTheme(getPreferredTheme());

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
    updateThemeToggleLabels();
  }

  function updateThemeToggleLabels() {
    const theme = document.documentElement.getAttribute('data-theme');
    const label = theme === 'dark' ? 'LIGHT' : 'DARK';
    document.querySelectorAll('.theme-toggle-text').forEach(btn => {
      btn.textContent = label;
    });
  }

  /* ========================================
     COMPONENT INJECTION
     ======================================== */

  function getBasePath() {
    const depth = document.querySelector('meta[name="path-depth"]');
    if (!depth) return '';
    const level = parseInt(depth.getAttribute('content'), 10);
    if (level === 0 || isNaN(level)) return '';
    return '../'.repeat(level);
  }

  async function loadComponent(selector, file) {
    const target = document.querySelector(selector);
    if (!target) return;

    const basePath = getBasePath();
    try {
      const response = await fetch(basePath + 'components/' + file);
      if (!response.ok) throw new Error('Failed to load ' + file);
      let html = await response.text();

      if (basePath) {
        html = html.replace(/href="\//g, 'href="' + basePath);
        html = html.replace(/src="\//g, 'src="' + basePath);
      }

      target.innerHTML = html;
    } catch (err) {
      console.warn('Could not load component:', file, err);
    }
  }

  /* ========================================
     NAVIGATION
     ======================================== */

  function highlightActiveNav() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a, .mobile-nav a');

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === path || path.endsWith(href) || (href === '/' && (path === '/' || path.endsWith('/index.html')))) {
        link.classList.add('active');
      }
    });
  }

  function setupHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  function setupThemeToggles() {
    document.querySelectorAll('.theme-toggle-text').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
    updateThemeToggleLabels();
  }

  /* ========================================
     LIVE CLOCK (IST)
     ======================================== */

  function startClock() {
    const el = document.getElementById('header-clock');
    if (!el) return;

    function tick() {
      const now = new Date();
      const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      let hours = ist.getHours();
      const mins = String(ist.getMinutes()).padStart(2, '0');
      const secs = String(ist.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      el.textContent = `${String(hours).padStart(2, '0')}:${mins}:${secs} ${ampm}`;
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ========================================
     POST LISTING
     ======================================== */

  function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function createPostCard(post) {
    const basePath = getBasePath();
    const card = document.createElement('a');
    card.className = 'post-card';
    card.href = basePath + post.path;

    const tagsHtml = post.tags.map(t =>
      `<span class="tag">${t}</span>`
    ).join('');

    card.innerHTML = `
      <div class="post-card-meta">
        <span class="post-card-date">${formatDate(post.date)}</span>
        <span class="post-card-reading-time">${post.readingTime || '?'} min</span>
        <span class="post-card-type">${post.type}</span>
      </div>
      <div class="post-card-content">
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <div class="post-card-tags">${tagsHtml}</div>
      </div>
    `;

    return card;
  }

  function renderPosts(posts, container) {
    container.innerHTML = '';
    if (posts.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No posts match that filter.</p></div>';
      return;
    }
    posts.forEach(post => {
      container.appendChild(createPostCard(post));
    });
  }

  function setupPostListing() {
    const grid = document.querySelector('#posts-grid');
    if (!grid || typeof POSTS === 'undefined') return;

    const sortedPosts = [...POSTS].sort((a, b) => new Date(b.date) - new Date(a.date));

    const allTags = [...new Set(sortedPosts.flatMap(p => p.tags))].sort();
    const filterContainer = document.querySelector('#tags-filter');

    if (filterContainer && allTags.length > 0) {
      const allBtn = document.createElement('button');
      allBtn.className = 'tag active';
      allBtn.textContent = 'All';
      allBtn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        allBtn.classList.add('active');
        renderPosts(sortedPosts, grid);
      });
      filterContainer.appendChild(allBtn);

      allTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag';
        btn.textContent = tag;
        btn.addEventListener('click', () => {
          filterContainer.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
          btn.classList.add('active');
          renderPosts(sortedPosts.filter(p => p.tags.includes(tag)), grid);
        });
        filterContainer.appendChild(btn);
      });
    }

    renderPosts(sortedPosts, grid);
  }

  function setupLatestPosts() {
    const grid = document.querySelector('#latest-posts');
    if (!grid || typeof POSTS === 'undefined') return;

    const latestPosts = [...POSTS]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    renderPosts(latestPosts, grid);
  }

  /* ========================================
     BOOKMARKS RENDERING
     ======================================== */

  function setupBookmarks() {
    const container = document.querySelector('#bookmarks-container');
    if (!container || typeof BOOKMARKS === 'undefined') return;

    BOOKMARKS.forEach(category => {
      const section = document.createElement('div');
      section.className = 'bookmarks-section';

      const heading = document.createElement('h2');
      heading.textContent = category.category;
      section.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'bookmarks-list';

      category.items.forEach(item => {
        const card = document.createElement('a');
        card.className = 'bookmark-card';
        card.href = item.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <span class="bookmark-url">${new URL(item.url).hostname}</span>
        `;
        list.appendChild(card);
      });

      section.appendChild(list);
      container.appendChild(section);
    });
  }

  /* ========================================
     INITIALIZATION
     ======================================== */

  async function init() {
    await Promise.all([
      loadComponent('#header-placeholder', 'header.html'),
      loadComponent('#footer-placeholder', 'footer.html')
    ]);

    setupThemeToggles();
    setupHamburger();
    highlightActiveNav();
    startClock();

    setupPostListing();
    setupLatestPosts();
    setupBookmarks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
