const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user's playlists
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('playlists likedSongs savedSongs');
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create playlist
router.post('/create', auth, async (req, res) => {
  try {
    const { name, mood, songs } = req.body;
    const user = await User.findById(req.user.id);
    user.playlists.push({ name, mood, songs: songs || [] });
    await user.save();
    res.json(user.playlists);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add song to playlist
router.post('/:playlistId/add-song', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const playlist = user.playlists.id(req.params.playlistId);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    playlist.songs.push(req.body.song);
    await user.save();
    res.json(playlist);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like song
router.post('/like', auth, async (req, res) => {
  try {
    const { songId } = req.body;
    const user = await User.findById(req.user.id);
    const idx = user.likedSongs.indexOf(songId);
    if (idx > -1) user.likedSongs.splice(idx, 1);
    else user.likedSongs.push(songId);
    await user.save();
    res.json({ likedSongs: user.likedSongs });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save song
router.post('/save', auth, async (req, res) => {
  try {
    const { song } = req.body;
    const user = await User.findById(req.user.id);
    const exists = user.savedSongs.find(s => s.id === song.id);
    if (exists) {
      user.savedSongs = user.savedSongs.filter(s => s.id !== song.id);
    } else {
      user.savedSongs.push(song);
    }
    await user.save();
    res.json({ savedSongs: user.savedSongs });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
