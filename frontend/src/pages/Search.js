import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SongCard from '../components/SongCard';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [savedSongs, setSavedSongs] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await axios.get('/api/songs/search?q=' + encodeURIComponent(query));
      setSongs(data);
    } catch {
      toast.error('Search failed, try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-hero">
        <h1>🔍 Find Your Song</h1>
        <p>Search any song, artist or vibe</p>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            placeholder="e.g. Taylor Swift, Arijit Singh, Kesariya..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="search-btn btn-primary" type="submit">Search</button>
        </form>
      </div>

      {loading && (
        <div className="playlist-loading">
          <div className="loading-dots"><span /><span /><span /></div>
          <p>Searching YouTube...</p>
        </div>
      )}

      {!loading && searched && songs.length === 0 && (
        <div className="search-empty">
          <p>No results found. Try a different search!</p>
        </div>
      )}

      {!loading && songs.length > 0 && (
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
                onAddToPlaylist={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
