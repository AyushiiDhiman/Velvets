import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PlayerModal from './PlayerModal';
import './SongCard.css';

const SongCard = ({ song, likedSongs = [], savedSongs = [], onLike, onSave, onAddToPlaylist }) => {
  const [imgError, setImgError] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  const isLiked = likedSongs.includes(song.id);
  const isSaved = savedSongs.some(s => s.id === song.id);

  const handleLike = async () => {
    try {
      const { data } = await axios.post('/api/playlists/like', { songId: song.id });
      onLike && onLike(data.likedSongs);
      toast.success(data.likedSongs.includes(song.id) ? '❤️ Liked!' : '💔 Unliked');
    } catch {
      toast.error('Please log in to like songs');
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.post('/api/playlists/save', { song });
      onSave && onSave(data.savedSongs);
      toast.success(data.savedSongs.some(s => s.id === song.id) ? '📌 Saved!' : 'Removed from saved');
    } catch {
      toast.error('Please log in to save songs');
    }
  };

  return (
    <>
      <div className="song-card card">
        <div className="song-cover">
          {!imgError ? (
            <img src={song.cover} alt={song.title} onError={() => setImgError(true)} />
          ) : (
            <div className="song-cover-placeholder">🎵</div>
          )}
          <div className="song-overlay" onClick={() => setShowPlayer(true)}>
            <button className="play-btn">▶</button>
          </div>
        </div>

        <div className="song-info">
          <div className="song-meta">
            <h4 className="song-title">{song.title}</h4>
            <p className="song-artist">{song.artist}</p>
          </div>
          <span className="song-duration">{song.duration}</span>
        </div>

        <div className="song-actions">
          <button className={`action-btn ${isLiked ? 'active' : ''}`} onClick={handleLike} title="Like">
            {isLiked ? '❤️' : '🤍'}
          </button>
          <button className={`action-btn ${isSaved ? 'active' : ''}`} onClick={handleSave} title="Save">
            {isSaved ? '🔖' : '📌'}
          </button>
          <button className="action-btn" onClick={() => onAddToPlaylist && onAddToPlaylist(song)} title="Add to playlist">
            ➕
          </button>
        </div>
      </div>

      {showPlayer && (
        <PlayerModal song={song} onClose={() => setShowPlayer(false)} />
      )}
    </>
  );
};

export default SongCard;
