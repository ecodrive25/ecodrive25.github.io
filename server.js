// Petit serveur sans dépendance, utilisé seulement pour Railway.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url.endsWith('/')) url += 'index.html';
  const file = path.normalize(path.join(ROOT, url));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) {
      return fs.readFile(path.join(ROOT, 'index.html'), (e, home) => {
        res.writeHead(e ? 404 : 200, { 'Content-Type': TYPES['.html'] });
        res.end(e ? 'Page introuvable' : home);
      });
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600'
    });
    res.end(data);
  });
}).listen(PORT, () => console.log('ECODRIVE25 en ligne sur le port ' + PORT));
