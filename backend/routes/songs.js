const router = require('express').Router();
const youtubeSearchApi = require('youtube-search-api');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Bollywood + Hollywood mood search queries
const moodQueries = {
  happy: [
    'Taylor Swift Anti Hero Cruel Summer 2024',
    'best punjabi party songs 2024 diljit dosanjh',
    'Ariana Grande happy pop hits 2024',
  ],
  sad: [
    'Arijit Singh sad songs 2024 hindi',
    'Olivia Rodrigo sad songs 2024',
    'best heartbreak bollywood songs 2023 2024',
  ],
  cherished: [
    'Shubh punjabi love songs 2024',
    'Taylor Swift love songs Lover Fearless',
    'best romantic bollywood songs 2024 arijit',
  ],
  broken: [
    'breakup songs hindi 2024 jubin nautiyal',
    'Olivia Rodrigo drivers license good 4 u',
    'best punjabi sad breakup songs 2024',
  ],
  focused: [
    'lofi hip hop study beats 2024',
    'bollywood instrumental focus music 2024',
    'A R Rahman peaceful instrumental music',
  ],
  motivation: [
    'Diljit Dosanjh pump up punjabi songs 2024',
    'best workout motivation english songs 2024',
    'motivational bollywood hits 2023 2024',
  ],
};

const formatYouTubeTrack = (video, mood, index) => {
  // YouTube thumbnails from their CDN
  const videoId = video.id;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  return {
    id: videoId,
    title: video.title,
    artist: video.channelTitle || 'Unknown Artist',
    album: mood,
    mood,
    cover: thumbnailUrl, // High quality YouTube thumbnail
    duration: '3:45',
    preview: null,
    spotifyUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
};

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

// Get songs by mood from YouTube
router.get('/mood/:mood', async (req, res) => {
  const { mood } = req.params;
  const queries = moodQueries[mood.toLowerCase()];
  if (!queries) return res.status(404).json({ message: 'Mood not found' });

  try {
    const results = await Promise.all(
      queries.map(q => youtubeSearchApi.GetListByKeyword(q, false, 8))
    );

    const seen = new Set();
    let tracks = [];
    
    results.forEach(r => {
      const items = r?.items || [];
      items.forEach((video, idx) => {
        if (video && video.id && !seen.has(video.id)) {
          seen.add(video.id);
          tracks.push(formatYouTubeTrack(video, mood, idx));
        }
      });
    });

    tracks = shuffle(tracks).slice(0, 24);
    console.log(`âœ… Found ${tracks.length} songs for mood: ${mood}`);
    res.json(tracks);
  } catch (err) {
    console.error('YouTube search error:', err.message || err);
    res.status(500).json({ message: 'Could not fetch songs' });
  }
});

// AI Picks from YouTube
router.get('/ai-picks', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const likedMoods = (user.savedSongs || []).map(s => s.mood).filter(Boolean);

    let moodsToUse;
    if (likedMoods.length >= 2) {
      const freq = {};
      likedMoods.forEach(m => freq[m] = (freq[m] || 0) + 1);
      moodsToUse = Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 3);
    } else {
      moodsToUse = shuffle(Object.keys(moodQueries)).slice(0, 3);
    }

    const picks = await Promise.all(
      moodsToUse.map(async (mood) => {
        const queries = moodQueries[mood];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        const data = await youtubeSearchApi.GetListByKeyword(randomQuery, false, 8);
        const items = data?.items || [];
        return items
          .slice(0, 5)
          .map((video, idx) => formatYouTubeTrack(video, mood, idx));
      })
    );

    const allPicks = shuffle(picks.flat()).slice(0, 15);
    res.json({ personalized: likedMoods.length >= 2, songs: allPicks });
  } catch (err) {
    console.error('AI picks error:', err.message || err);
    res.status(500).json({ message: 'Could not generate picks' });
  }
});

// Get YouTube video (already have video ID from search, so this just validates)
router.get('/youtube/:title/:artist', async (req, res) => {
  try {
    const { title, artist } = req.params;
    const searchQuery = `${title} ${artist} official`;
    const result = await youtubeSearchApi.GetListByKeyword(searchQuery, false, 1);
    const video = result?.items?.[0];
    if (!video) return res.status(404).json({ message: 'No video found' });
    res.json({ videoId: video.id, title: video.title });
  } catch (err) {
    console.error('YouTube search error:', err.message);
    res.status(500).json({ message: 'YouTube search failed' });
  }
});

// Search songs
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query required' });
  try {
    const data = await youtubeSearchApi.GetListByKeyword(q, false, 10);
    const tracks = (data?.items || [])
      .slice(0, 10)
      .map((video, idx) => formatYouTubeTrack(video, 'search', idx));
    res.json(tracks);
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;
