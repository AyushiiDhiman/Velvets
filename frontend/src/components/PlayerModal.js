import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PlayerModal.css';

const PlayerModal = ({ song, onClose }) => {
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      setError(false);
      try {
        const { data } = await axios.get(
          `/api/songs/youtube/${encodeURIComponent(song.title)}/${encodeURIComponent(song.artist)}`
        );
        setVideoId(data.videoId);
      } catch {
        setError(true);
        toast.error('Could not find this song to play');
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [song]);

  return (
    <div className="player-overlay" onClick={onClose}>
      <div className="player-card card" onClick={e => e.stopPropagation()}>
        <button className="player-close" onClick={onClose}>✕</button>

        <div className="player-header">
          <img src={song.cover} alt={song.title} className="player-cover" />
          <div>
            <h3>{song.title}</h3>
            <p>{song.artist}</p>
          </div>
        </div>

        <div className="player-video-wrap">
          {loading && (
            <div className="player-loading">
              <div className="loading-dots"><span /><span /><span /></div>
              <p>Finding your song...</p>
            </div>
          )}
          {!loading && error && (
            <div className="player-error">
              <span>😔</span>
              <p>Couldn't load this song right now</p>
              {song.spotifyUrl && (
                <a href={song.spotifyUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  Open in Spotify
                </a>
              )}
            </div>
          )}
          {!loading && !error && videoId && (
            <iframe
              width="100%"
              height="220"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={song.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '12px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;