import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SongCard from './SongCard';
import CreatePlaylistModal from './CreatePlaylistModal';
import './AIPicks.css';

const AIPicks = () => {
  const [songs, setSongs] = useState([]);
  const [personalized, setPersonalized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [likedSongs, setLikedSongs] = useState([]);
  const [savedSongs, setSavedSongs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [songToAdd, setSongToAdd] = useState(null);

  useEffect(() => {
    const fetchPicks = async () => {
      setLoading(true);
      try {
        const [picksRes, userRes] = await Promise.all([
          axios.get('/api/songs/ai-picks'),
          axios.get('/api/playlists'),
        ]);
        setSongs(picksRes.data.songs);
        setPersonalized(picksRes.data.personalized);
        setLikedSongs(userRes.data.likedSongs || []);
        setSavedSongs(userRes.data.savedSongs || []);
      } catch {
        // fail silently, this is a bonus section
      } finally {
        setLoading(false);
      }
    };
    fetchPicks();
  }, []);

  if (loading) {
    return (
      <div className="ai-picks-section">
        <div className="ai-picks-header">
          <h2>✨ AI Picks for You</h2>
        </div>
        <div className="ai-picks-loading">
          <div className="loading-dots"><span /><span /><span /></div>
        </div>
      </div>
    );
  }

  if (!songs.length) return null;

  return (
    <div className="ai-picks-section">
      <div className="ai-picks-header">
        <h2>✨ AI Picks for You</h2>
        <p>{personalized ? 'Based on what you love' : 'Curated just for today'}</p>
      </div>
      <div className="ai-picks-scroll">
        {songs.map(song => (
          <div className="ai-pick-item" key={song.id}>
            <SongCard
              song={song}
              likedSongs={likedSongs}
              savedSongs={savedSongs}
              onLike={setLikedSongs}
              onSave={setSavedSongs}
              onAddToPlaylist={(s) => { setSongToAdd(s); setShowModal(true); }}
            />
          </div>
        ))}
      </div>

      {showModal && (
        <CreatePlaylistModal
          mood={songToAdd?.mood || 'happy'}
          songToAdd={songToAdd}
          onClose={() => { setShowModal(false); setSongToAdd(null); }}
        />
      )}
    </div>
  );
};

export default AIPicks;