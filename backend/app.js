// ==========================================================
// APPLICATION EXPRESS POUR ATELIER TESTS
// ==========================================================

const express = require('express');
const app = express();

// Middleware JSON
app.use(express.json());

// ==========================================================
// ROUTES
// ==========================================================

// Route GET simple
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Route GET avec paramètre
app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.json({ message: `Hello ${name}!` });
});

// Route POST avec calcul
app.post('/calculate', (req, res) => {
  const { a, b } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'a et b doivent être des nombres' });
  }
  
  const result = a + b;
  res.json({ result });
});

// Export pour les tests
module.exports = app;