const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      // required: true,
    },

    markdown: {
      type: String,
      required: true,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
      ref: 'User',
    },
    photo: {
      type: String,
      required: false,
    },
    categories: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
