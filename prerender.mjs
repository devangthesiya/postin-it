import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, 'dist');

const template = fs.readFileSync(path.resolve(dist, 'index.html'), 'utf-8');

const { render, getRoutes } = await import('./dist/server/entry-server.js');
const routes = getRoutes();

console.log('Prerendering', routes.length, 'routes...');

for (const route of routes) {
  const html = render(route);
  const finalHtml = template.replace(
    '<div id="root"></div>',
    '<div id="root">' + html + '</div>'
  );

  const filePath = route === '/'
    ? path.resolve(dist, 'index.html')
    : path.resolve(dist, route.slice(1), 'index.html');

  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, finalHtml);

  console.log('  ✓', route);
}

console.log('Done! All routes prerendered.');
