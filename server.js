/**
 * Servidor simples para hospedar chunks do Re.Pack
 *
 * Para usar:
 * 1. npm install express cors
 * 2. node server.js
 * 3. Copie os chunks gerados para a pasta ./bundles
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Habilitar CORS para permitir que o app acesse os bundles
app.use(cors());

// Servir arquivos estáticos da pasta bundles
app.use('/bundles', express.static(path.join(__dirname, 'bundles'), {
  setHeaders: (res, filepath) => {
    // Configurar headers corretos para bundles JS
    if (filepath.endsWith('.bundle') || filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor de chunks rodando' });
});

// Listar chunks disponíveis
app.get('/bundles/list', (req, res) => {
  const fs = require('fs');
  const bundlesDir = path.join(__dirname, 'bundles');

  if (!fs.existsSync(bundlesDir)) {
    return res.status(404).json({ error: 'Pasta bundles não encontrada' });
  }

  const files = fs.readdirSync(bundlesDir);
  res.json({ chunks: files });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║  🚀 Servidor de Chunks Re.Pack                           ║
╟───────────────────────────────────────────────────────────╢
║  URL: http://localhost:${PORT}                              ║
║  Bundles: http://localhost:${PORT}/bundles                  ║
║  Health: http://localhost:${PORT}/health                    ║
║  Lista: http://localhost:${PORT}/bundles/list               ║
╠═══════════════════════════════════════════════════════════╣
║  📝 Instruções:                                           ║
║  1. Gere os bundles: npm run bundle                       ║
║  2. Copie para ./bundles                                  ║
║  3. Configure isRemote=true no RemoteButton.tsx           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
