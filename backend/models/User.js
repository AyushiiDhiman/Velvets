const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Songs
  likedSongs: [{ type: String }],
  savedSongs: [{
    id: String,
    title: String,
    artist: String,
    mood: String,
    cover: String,
    duration: String
  }],
  playlists: [{
    name: String,
    mood: String,
    songs: [{
      id: String,
      title: String,
      artist: String,
      mood: String,
      cover: String,
      duration: String
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Books
  likedBooks: [{ type: String }],
  savedBooks: [{
    id: String,
    title: String,
    author: String,
    cover: String,
    description: String,
    rating: Number,
    purchaseLinks: {
      amazon: String,
      goodreads: String,
      flipkart: String,
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
