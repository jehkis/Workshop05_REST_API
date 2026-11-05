const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    // Otsikko: pakollinen, välilyönnit reunoilta pois (trim), vähintään 3 merkkiä.
    title: {
      type: String,
      required: [true, 'Otsikko on pakollinen'],
      trim: true,
      minlength: [3, 'Otsikossa pitää olla vähintään 3 merkkiä']
    },
    // Sisältö: pakollinen, vähintään 10 merkkiä.
    content: {
      type: String,
      required: [true, 'Sisältö on pakollinen'],
      trim: true,
      minlength: [10, 'Sisällössä pitää olla vähintään 10 merkkiä']
    },
    // Kirjoittaja: pakollinen, vähintään 2 merkkiä.
    author: {
      type: String,
      required: [true, 'Kirjoittaja on pakollinen'],
      trim: true,
      minlength: [2, 'Kirjoittajan nimessä pitää olla vähintään 2 merkkiä']
    }
  },
  {
    // timestamps lisää jokaiselle postaukselle automaattisesti kentät createdAt ja updatedAt.
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);