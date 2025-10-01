import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from dist
app.use(express.static(path.join(__dirname, '../src')));

// homepage route
app.get('/logo', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/logo.html'));
});
// // home route
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/home.html'));
});
//manager route
app.get('/manager', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/manager.html'));
});
app.get('/api/endpoint', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
})
// app.post('/api/endpoint', (req, res) => {
//   const data = req.body
//   res.json({message: `Data recieved successfully`})
// })

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})


