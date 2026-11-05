const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Yhteinen virheenkäsittely: validointivirhe -> 400, kaikki muu -> 500.
function handleError(res, error) {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      error: 'Validointivirhe',
      // Kerätään mallin virheviestit taulukoksi, esim. ["Otsikko on pakollinen"].
      details: Object.values(error.errors).map((e) => e.message)
    });
  }
  console.error(error);
  return res.status(500).json({ error: 'Palvelinvirhe' });
}

// POST /api/posts – luo uuden postauksen.
router.post('/', async (req, res) => {
  try {
    // Luodaan uusi Post-dokumentti pyynnön rungosta (title, content, author).
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    });
    // save() ajaa mallin validoinnit ja tallentaa dokumentin MongoDB:hen.
    await post.save();
    // 201 Created + luotu postaus (sisältää _id:n ja aikaleimat).
    return res.status(201).json(post);
  } catch (error) {
    return handleError(res, error);
  }
});

// GET /api/posts – hakee kaikki postaukset, uusin ensin.
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    return handleError(res, error);
  }
});

// GET /api/posts/:id – hakee yhden postauksen id:n perusteella.
router.get('/:id', async (req, res) => {
  // 400, jos id ei ole MongoDB:n ObjectId-muotoa.
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  try {
    const post = await Post.findById(req.params.id);
    // 404, jos id on oikeaa muotoa mutta postausta ei ole.
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch (error) {
    return handleError(res, error);
  }
});

// PUT /api/posts/:id – korvaa postauksen kentät uusilla.
router.put('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // PUT korvaa koko postauksen: kaikki kentät asetetaan pyynnön rungosta.
    // Jos jokin kenttä puuttuu, save() palauttaa validointivirheen (400).
    post.title = req.body.title;
    post.content = req.body.content;
    post.author = req.body.author;
    await post.save(); // päivittää myös updatedAt-aikaleiman
    return res.status(200).json(post);
  } catch (error) {
    return handleError(res, error);
  }
});

// DELETE /api/posts/:id – poistaa postauksen.
router.delete('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }

  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json({ message: 'Post deleted', id: post._id });
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = router;
