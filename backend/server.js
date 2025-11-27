// ==========================================================
// SERVEUR EXPRESS (optionnel - pour lancer l'API)
// ==========================================================

const app = require('./app');

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 Routes disponibles :`);
  console.log(`   GET  /hello`);
  console.log(`   GET  /hello/:name`);
  console.log(`   POST /calculate`);
});