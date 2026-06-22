const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  googleBooksId: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  cover: String,
  category: String,
  moods: [String], // ['self-help', 'romance', 'thriller', etc.]
  rating: Number,
  purchaseLinks: {
    amazon: String,
    goodreads: String,
    flipkart: String,
    bookswagon: String,
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);