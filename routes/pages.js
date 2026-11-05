const path = require('path');
const express = require('express');

const router = express.Router();

function sendPage(req, res, fileName) {
  res.sendFile(path.join(req.app.locals.publicDir, fileName));
}

router.get('/', (req, res) => {
  // Lähetetään public/index.html selaimelle.
  sendPage(req, res, 'index.html');
});

router.get('/about', (req, res) => {
  // Lähetetään public/about.html selaimelle.
  sendPage(req, res, 'about.html');
});

router.get('/contact', (req, res) => {
  // Lähetetään public/contact.html selaimelle.
  sendPage(req, res, 'contact.html');
});

router.get('/blog', (req, res) => {
  // Lähetetään public/blog.html selaimelle.
  sendPage(req, res, 'blog.html');
});

module.exports = router;