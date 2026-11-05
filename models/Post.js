const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    // TODO (student): Define the post fields for this schema.
    // Suggested minimum fields:
    // - title: String, required, trim
    // - content: String, required, trim
    // - author: String, required, trim
  },
  {
    // TODO (student): Keep timestamps enabled (or decide based on requirements).
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);