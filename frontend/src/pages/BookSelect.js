import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './BookSelect.css';

const bookCategories = [
  { key: 'self-help',       emoji: '📚', label: 'Self-Help',    desc: 'Grow & transform yourself',           color: '#FFD6A5' },
  { key: 'science-fiction', emoji: '🚀', label: 'Sci-Fi',       desc: 'Future tech & space adventures',     color: '#C9D6FF' },
  { key: 'thriller',        emoji: '🔪', label: 'Thriller',     desc: 'Edge-of-your-seat suspense',        color: '#C9D6FF' },
  { key: 'bestseller',      emoji: '⭐', label: 'Bestsellers',  desc: 'Most loved books worldwide',          color: '#B5EAD7' },
];
const BookSelect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="book-page">
      <div className="book-hero">
        <h1>Discover Your Next Read,<br /><span>{user?.name?.split(' ')[0]}!</span></h1>
        <p>Curated books for every mood and interest 📖✨</p>
      </div>

      <div className="book-grid">
        {bookCategories.map(cat => (
          <button
            key={cat.key}
            className="book-card-category"
            style={{ '--book-color': cat.color }}
            onClick={() => navigate(`/books/${cat.key}`)}
          >
            <span className="book-emoji">{cat.emoji}</span>
            <h3>{cat.label}</h3>
            <p>{cat.desc}</p>
            <div className="book-arrow">→</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookSelect;