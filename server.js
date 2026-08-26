const http = require('http');

const fs = require('fs');

const path = require('path');

const { ensureDataFiles, loadGantt, saveGantt } = require('./backend/ganttStore');

ensureDataFiles();



// Puerto por el que se accederá al frontend

const PORT = 8080;

 

// Ajusta esta ruta a la carpeta donde colocaste la compilación de tu Frontend.

// Si usaste React/Vue y pegaste la carpeta 'dist' dentro de 'frontend', usa: 'frontend/dist'

// Si pegaste tus archivos directamente dentro de 'frontend', déjalo como: 'frontend'

const PUBLIC_DIR = path.join(__dirname, 'frontend', 'dist');

 

// Mapa de Tipos MIME para que el navegador reconozca cada tipo de archivo

const mimeTypes = {

  '.html': 'text/html; charset=utf-8',

  '.js': 'text/javascript; charset=utf-8',

  '.css': 'text/css; charset=utf-8',

  '.json': 'application/json',

  '.png': 'image/png',

  '.jpg': 'image/jpeg',

  '.jpeg': 'image/jpeg',

  '.gif': 'image/gif',

  '.svg': 'image/svg+xml',

  '.ico': 'image/x-icon',

  '.woff': 'font/woff',

  '.woff2': 'font/woff2',

  '.ttf': 'font/ttf'

};

 

const server = http.createServer((req, res) => {

  // --- API del Gantt (datos compartidos en CSV) — debe ir antes de servir estáticos ---

  const apiPath = req.url.split('?')[0];

  if (apiPath === '/api/gantt' && req.method === 'GET') {

    try {

      const data = loadGantt();

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

      res.end(JSON.stringify(data));

    } catch (error) {

      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });

      res.end(JSON.stringify({ error: 'gantt_load_failed', message: String((error && error.message) || error) }));

    }

    return;

  }

  if (apiPath === '/api/gantt' && req.method === 'POST') {

    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));

    req.on('end', () => {

      try {

        const body = JSON.parse(Buffer.concat(chunks).toString('utf-8') || '{}');

        if (!body || !Array.isArray(body.projects)) {

          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });

          res.end(JSON.stringify({ error: 'invalid_body' }));

          return;

        }

        saveGantt(body);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

        res.end(JSON.stringify({ ok: true }));

      } catch (error) {

        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });

        res.end(JSON.stringify({ error: 'gantt_save_failed', message: String((error && error.message) || error) }));

      }

    });

    req.on('error', () => {

      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });

      res.end(JSON.stringify({ error: 'request_error' }));

    });

    return;

  }

  // --- fin API del Gantt ---

  // Limpiar parámetros de consulta de la URL (Query params)

  let sanitizeUrl = req.url.split('?')[0];

 

  // Definir la ruta del archivo solicitado

  let filePath = path.join(PUBLIC_DIR, sanitizeUrl === '/' ? 'index.html' : sanitizeUrl);

 

  // Obtener extensión del archivo

  let extname = String(path.extname(filePath)).toLowerCase();

  let contentType = mimeTypes[extname] || 'application/octet-stream';

 

  fs.readFile(filePath, (error, content) => {

    if (error) {

      if (error.code === 'ENOENT') {

        // Soporte SPA (Single Page Application para React/Vue/Angular):

        // Si no encuentra el archivo o ruta estática, devuelve el index.html principal

        const indexPath = path.join(PUBLIC_DIR, 'index.html');

        fs.readFile(indexPath, (errIndex, indexContent) => {

          if (errIndex) {

            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });

            res.end('<h1>404 - Carpeta de frontend no encontrada</h1>', 'utf-8');

          } else {

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

            res.end(indexContent, 'utf-8');

          }

        });

      } else {

        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });

        res.end(`Error de servidor: ${error.code}`);

      }

    } else {

      res.writeHead(200, { 'Content-Type': contentType });

      res.end(content, 'utf-8');

    }

  });

});

 

server.listen(PORT, '0.0.0.0', () => {

  console.log(`\n======================================================`);

  console.log(`🚀 Servidor Frontend desplegado exitosamente`);

  console.log(`======================================================`);

  console.log(` Acceso Local (en esta PC): [http://localhost:$%7bPORT%7d%60]http://localhost:${PORT}`);

  console.log(` Acceso Red Interna (Otras PCs): http://<IP_DE_ESTA_PC>:${PORT}`);

  console.log(`======================================================\n`);

});