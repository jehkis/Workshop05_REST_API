const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const pagesRouter = require('./routes/pages');
const postsRouter = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

async function connectToDatabase() {
  // 1) Tarkistetaan, että yhteysosoite on määritelty .env-tiedostossa.
  if (!process.env.MONGODB_URI) {
    console.error('Virhe: MONGODB_URI puuttuu. Luo .env-tiedosto .env.example-tiedoston pohjalta.');
    process.exit(1);
  }

  try {
    // 2) Yhdistetään MongoDB:hen. dbName valitsee tietokannan "blog".
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'blog' });
    // 3) Kerrotaan onnistumisesta.
    console.log('Yhdistetty MongoDB:hen (tietokanta: blog)');
  } catch (error) {
    // Yhteys epäonnistui (väärä salasana, IP-osoitetta ei sallittu Atlasissa tms.).
    console.error('MongoDB-yhteys epäonnistui:', error.message);
    process.exit(1);
  }
}

app.locals.publicDir = publicDir;
app.use(express.json());
app.use(express.static(publicDir));

// Sivureitit (selaimelle HTML-sivut).
app.use('/', pagesRouter);

// REST API -reitit (JSON).
app.use('/api/posts', postsRouter);

// 404: tuntematon osoite. API-pyynnöille JSON, selaimelle 404.html-sivu.
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.status(404).sendFile(path.join(publicDir, '404.html'));
});

// 500: palvelinvirheet. Express tunnistaa virheenkäsittelijän neljästä parametrista.
app.use((error, req, res, next) => {
  // Rikkinäinen JSON pyynnön rungossa on asiakkaan virhe (400), ei palvelimen.
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  console.error(error.stack);
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({ error: 'Server error' });
  }
  res.status(500).sendFile(path.join(publicDir, '500.html'));
});

// Palvelin käynnistetään vasta, kun tietokantayhteys on valmis.
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Palvelin käynnissä: http://localhost:${PORT}`);
    console.log('Sivut:');
    console.log('  GET    /  /about  /contact  /blog');
    console.log('API (routes/posts.js):');
    console.log('  POST   /api/posts        luo postaus');
    console.log('  GET    /api/posts        kaikki postaukset');
    console.log('  GET    /api/posts/:id    yksi postaus');
    console.log('  PUT    /api/posts/:id    päivitä postaus');
    console.log('  DELETE /api/posts/:id    poista postaus');
  });
});
