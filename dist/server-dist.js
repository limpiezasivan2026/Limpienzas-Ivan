// server-dist.js — Servidor para la versión minificada (producción)
const express = require('express');
const path = require('path');
const compression = require('compression');
const app = express();

const PORT = process.env.PORT || 8001;

app.use(compression());
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1d'
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de PRODUCCIÓN en http://localhost:${PORT}`);
});