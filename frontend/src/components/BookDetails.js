import React from 'react';
import './BookDetails.css';

const BookDetails = ({ book, onClose }) => {
  return (
    <div className="book-details-overlay" onClick={onClose}>
      <div className="book-details-card card" onClick={e => e.stopPropagation()}>
        <button className="book-details-close" onClick={onClose}>✕</button>

        <div className="book-details-header">
          <img src={book.cover} alt={book.title} className="book-details-cover" />
          <div className="book-details-info">
            <h2>{book.title}</h2>
            <p className="book-details-author">by {book.author}</p>
            {book.rating && <p className="book-details-rating">⭐ {book.rating}/5</p>}
            <p className="book-details-description">{book.description}</p>
          </div>
        </div>

        <div className="book-purchase-section">
          <h3>Read This Book</h3>
          <div className="purchase-links">
            {book.goodreads && (
              <a 
                href={book.goodreads} 
                target="_blank" 
                rel="noreferrer"
                className="purchase-btn goodreads-single"
              >
                <span className="store-icon">📖</span>
                <span className="store-name">Read on Goodreads</span>
              </a>
            )}
          </div>
        </div>

        <button className="btn-primary close-details-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BookDetails;