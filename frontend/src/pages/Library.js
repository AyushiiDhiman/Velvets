import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Library.css';

const Library = () => {
  const [tab, setTab] = useState('saved');
  const [savedSongs, setSavedSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/api/playlists');
        setSavedSongs(data.savedSongs || []);
        setLikedSongs(data.likedSongs || []);
        setPlaylists(data.playlists || []);
      } catch {
        toast.error('Could not load library');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleUnsave = async (songId) => {
    const song = savedSongs.find(s => s.id === songId);
    try {
      const { data } = await axios.post('/api/playlists/save', { song });
      setSavedSongs(data.savedSongs);
      toast.success('Removed from saved');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleUnlike = async (songId) => {
    try {
      const { data } = await axios.post('/api/playlists/like', { songId });
      setLikedSongs(data.likedSongs);
      toast.success('Removed from liked');
    } catch {
      toast.error('Something went wrong');
    }
  };

  if (loading) return (
    <div className="library-loading">
      <div className="loading-dots"><span /><span /><span /></div>
      <p>Loading your library...</p>
    </div>
  );

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>My Library</h1>
        <p>All your music, all in one place 🎶</p>
      </div>

      <div className="library-tabs">
        {['saved', 'liked', 'playlists'].map(t => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'saved' && '📌 Saved'}
            {t === 'liked' && '❤️ Liked'}
            {t === 'playlists' && '🎵 Playlists'}
          </button>
        ))}
      </div>

      <div className="library-content">
        {/* Saved Songs */}
        {tab === 'saved' && (
          savedSongs.length === 0
            ? <EmptyState icon="📌" text="No saved songs yet" sub="Save songs from any playlist to find them here" />
            : <div className="song-list">
                {savedSongs.map(song => (
                  <LibrarySongRow
                    key={song.id}
                    song={song}
                    actionIcon="📌"
                    actionTip="Remove"
                    onAction={() => handleUnsave(song.id)}
                  />
                ))}
              </div>
        )}

        {/* Liked Songs */}
        {tab === 'liked' && (
          likedSongs.length === 0
            ? <EmptyState icon="❤️" text="No liked songs yet" sub="Like songs from any playlist to collect them here" />
            : <div className="song-list liked-placeholder">
                <p className="liked-note">You've liked <strong>{likedSongs.length}</strong> songs. Visit a playlist to see and manage them!</p>
                <div className="liked-ids">
                  {likedSongs.map(id => (
                    <span key={id} className="liked-chip">
                      🎵 Song #{id}
                      <button onClick={() => handleUnlike(id)}>✕</button>
                    </span>
                  ))}
                </div>
              </div>
        )}

        {/* Playlists */}
        {tab === 'playlists' && (
          playlists.length === 0
            ? <EmptyState icon="🎵" text="No playlists yet" sub="Create a playlist from any mood page" />
            : <div className="playlists-grid">
                {playlists.map(pl => (
                  <div key={pl._id} className="playlist-card card">
                    <div
                      className="playlist-card-header"
                      onClick={() => setExpandedPlaylist(expandedPlaylist === pl._id ? null : pl._id)}
                    >
                      <div className="playlist-card-icon">🎶</div>
                      <div className="playlist-card-info">
                        <h3>{pl.name}</h3>
                        <p>{pl.songs?.length || 0} songs · <span className="mood-badge">{pl.mood}</span></p>
                      </div>
                      <span className="expand-icon">{expandedPlaylist === pl._id ? '▲' : '▼'}</span>
                    </div>
                    {expandedPlaylist === pl._id && (
                      <div className="playlist-songs">
                        {pl.songs?.length === 0
                          ? <p className="no-songs">No songs in this playlist yet</p>
                          : pl.songs.map(song => (
                              <LibrarySongRow key={song.id} song={song} />
                            ))
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>
        )}
      </div>
    </div>
  );
};

const LibrarySongRow = ({ song, actionIcon, actionTip, onAction }) => (
  <div className="library-song-row">
    <img src={song.cover} alt={song.title} className="lib-song-cover"
      onError={e => { e.target.style.display='none'; }} />
    <div className="lib-song-meta">
      <span className="lib-song-title">{song.title}</span>
      <span className="lib-song-artist">{song.artist}</span>
    </div>
    <span className="lib-song-duration">{song.duration}</span>
    {onAction && (
      <button className="lib-action-btn" onClick={onAction} title={actionTip}>
        {actionIcon}
      </button>
    )}
  </div>
);

const EmptyState = ({ icon, text, sub }) => (
  <div className="empty-state">
    <span>{icon}</span>
    <h3>{text}</h3>
    <p>{sub}</p>
  </div>
);

export default Library;
