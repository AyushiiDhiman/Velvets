import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CreatePlaylistModal.css';

const CreatePlaylistModal = ({ mood, songToAdd, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return toast.error('Give your playlist a name!');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/playlists/create', {
        name,
        mood,
        songs: songToAdd ? [songToAdd] : []
      });
      toast.success(`🎵 "${name}" created!`);
      onCreated && onCreated(data);
      onClose();
    } catch {
      toast.error('Could not create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <span className="modal-icon">🎶</span>
          <h2>Create Playlist</h2>
          {songToAdd && (
            <p>Adding <strong>{songToAdd.title}</strong> to a new playlist</p>
          )}
        </div>
        <div className="input-group">
          <label>Playlist Name</label>
          <input
            type="text"
            placeholder="e.g. Late Night Feels"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
        </div>
        <div className="modal-mood">
          <span>Mood:</span>
          <span className="mood-badge">{mood}</span>
        </div>
        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleCreate} disabled={loading}>
            {loading ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
