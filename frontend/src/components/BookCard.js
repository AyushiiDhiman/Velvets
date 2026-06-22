import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './BookCard.css';

const BookCard = ({ book, likedBooks = [], savedBooks = [], onLike, onSave, onShowDetails }) => {
  const [imgError, setImgError] = useState(false);

  const isLiked = likedBooks.includes(book.id);
  const isSaved = savedBooks.some(b => b.id === book.id);

  const handleLike = async () => {
    try {
      const { data } = await axios.post('/api/books/like', { bookId: book.id });
      onLike && onLike(data.likedBooks);
      toast.success(data.likedBooks.includes(book.id) ? '❤️ Liked!' : '💔 Unliked');
    } catch {
      toast.error('Please log in to like books');
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await axios.post('/api/books/save', { book });
      onSave && onSave(data.savedBooks);
      toast.success(data.savedBooks.some(b => b.id === book.id) ? '📚 Saved!' : 'Removed from saved');
    } catch {
      toast.error('Please log in to save books');
    }
  };

  return (
    <div className="book-card card">
      <div className="book-cover">
        {!imgError ? (
          <img src={book.cover} alt={book.title} onError={() => setImgError(true)} />
        ) : (
          <div className="book-cover-placeholder">📖</div>
        )}
        <div className="book-overlay" onClick={() => onShowDetails && onShowDetails(book)}>
          <button className="book-view-btn">View Details</button>
        </div>
      </div>

      <div className="book-info">
        <div className="book-meta">
          <h4 className="book-title">{book.title}</h4>
          <p className="book-author">{book.author}</p>
        </div>
        {book.rating && <span className="book-rating">⭐ {book.rating}</span>}
      </div>

      <div className="book-actions">
        <button className={`book-action-btn ${isLiked ? 'active' : ''}`} onClick={handleLike} title="Like">
          {isLiked ? '❤️' : '🤍'}
        </button>
        <button className={`book-action-btn ${isSaved ? 'active' : ''}`} onClick={handleSave} title="Save">
          {isSaved ? '📚' : '📌'}
        </button>
        <button 
          className="book-action-btn" 
          onClick={() => onShowDetails && onShowDetails(book)} 
          title="Buy"
        >
          🛒
        </button>
      </div>
    </div>
  );
};

export default BookCard;