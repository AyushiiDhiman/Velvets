import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import SongCard from '../components/SongCard';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import './Playlist.css';

const moodMeta = {
  happy:      { emoji: '🌟', gradient: 'linear-gradient(135deg, #FFD6A5, #FFAAA5)', label: 'Happy' },
  sad:        { emoji: '🌧️', gradient: 'linear-gradient(135deg, #C9D6FF, #A8C0FF)', label: 'Sad' },
  romantic:   { emoji: '🌹', gradient: 'linear-gradient(135deg, #FFB3C6, #FF8FAB)', label: 'Romantic' },
  broken:     { emoji: '💔', gradient: 'linear-gradient(135deg, #E2CFEA, #C5A3D4)', label: 'Broken' },
  focused:    { emoji: '🎯', gradient: 'linear-gradient(135deg, #B5EAD7, #85D6B8)', label: 'Focused' },
  motivation: { emoji: '🔥', gradient: 'linear-gradient(135deg, #FFDAC1, #FFB347)', label: 'Motivation' },
};

const Playlist = () => {
  const { mood } = useParams();
  const navigate = useNavigate();
  const meta = moodMeta[mood] || moodMeta.happy;

  const [songs, setSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [savedSongs, setSavedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [songsRes, userRes] = await Promise.all([
          axios.get(`/api/songs/mood/${mood}`),
          axios.get('/api/playlists')
        ]);
        setSongs(songsRes.data);
        setLikedSongs(userRes.data.likedSongs || []);
        setSavedSongs(userRes.data.savedSongs || []);
      } catch {
        toast.error('Could not load playlist');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mood]);

  const handleAddToPlaylist = (song) => {
    setSongToAdd(song);
    setShowModal(true);
  };

  return (
    <div className="playlist-page">
      {/* Hero Banner */}
      <div className="playlist-hero" style={{ background: meta.gradient }}>
        <button className="back-btn" onClick={() => navigate('/mood')}>← Back</button>
        <div className="hero-content">
          <span className="hero-emoji">{meta.emoji}</span>
          <h1>{meta.label} Playlist</h1>
          <p>{songs.length} songs curated for your mood</p>
        </div>
        <button
          className="create-playlist-btn btn-primary"
          onClick={() => { setSongToAdd(null); setShowModal(true); }}
        >
          + Create Playlist
        </button>
      </div>

      {/* Songs Grid */}
      {loading ? (
        <div className="playlist-loading">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
          <p>Finding the perfect songs...</p>
        </div>
      ) : (
        <div className="songs-section">
          <div className="songs-grid">
            {songs.map(song => (
              <SongCard
                key={song.id}
                song={song}
                likedSongs={likedSongs}
                savedSongs={savedSongs}
                onLike={setLikedSongs}
                onSave={setSavedSongs}
                onAddToPlaylist={handleAddToPlaylist}
              />
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <CreatePlaylistModal
          mood={mood}
          songToAdd={songToAdd}
          onClose={() => { setShowModal(false); setSongToAdd(null); }}
          onCreated={() => {}}
        />
      )}
    </div>
  );
};

export default Playlist;
