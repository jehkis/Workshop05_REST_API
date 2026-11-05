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

// TODO: Complete the page routes in routes/pages.js.
app.use('/', pagesRouter);

// TODO: Complete the API routes in routes/posts.js.
app.use('/api/posts', postsRouter);

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, '404.html'));
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).sendFile(path.join(publicDir, '500.html'));
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Mounted routers:');
    console.log('  / -> routes/pages.js');
    console.log('  /api/posts -> routes/posts.js');
  });
});