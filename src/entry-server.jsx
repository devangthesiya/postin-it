import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { POSTS } from './data/posts';

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}

export function getRoutes() {
  const staticRoutes = ['/', '/posts', '/about', '/contact', '/bookmarks'];
  const postRoutes = POSTS.map(p => '/posts/' + p.slug);
  return [...staticRoutes, ...postRoutes];
}
