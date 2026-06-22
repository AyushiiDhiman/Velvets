import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import BookCard from '../components/BookCard';
import BookDetails from '../components/BookDetails';
import './BookPlaylist.css';

const categoryMeta = {
  'self-help':       { emoji: '📚', gradient: 'linear-gradient(135deg, #FFD6A5, #FFAAA5)', label: 'Self-Help' },
  'science-fiction': { emoji: '🚀', gradient: 'linear-gradient(135deg, #C9D6FF, #A8C0FF)', label: 'Sci-Fi' },
  'thriller':        { emoji: '🔪', gradient: 'linear-gradient(135deg, #C9D6FF, #A8C0FF)', label: 'Thriller' },
  'bestseller':      { emoji: '⭐', gradient: 'linear-gradient(135deg, #B5EAD7, #85D6B8)', label: 'Bestsellers' },
};
const BookPlaylist = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const meta = categoryMeta[category] || categoryMeta['self-help'];

  const [books, setBooks] = useState([]);
  const [likedBooks, setLikedBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const [booksRes, userRes] = await Promise.all([
          axios.get(`/api/books/category/${category}`),
          axios.get('/api/playlists')
        ]);
        setBooks(booksRes.data);
        setLikedBooks(userRes.data.likedBooks || []);
        setSavedBooks(userRes.data.savedBooks || []);
      } catch (err) {
        toast.error('Could not load books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [category]);

  const handleShowDetails = (book) => {
    setSelectedBook(book);
    setShowDetails(true);
  };

  return (
    <div className="book-playlist-page">
      {/* Hero Banner */}
      <div className="book-hero-banner" style={{ background: meta.gradient }}>
        <button className="back-btn-book" onClick={() => navigate('/books')}>← Back</button>
        <div className="book-hero-content">
          <span className="book-hero-emoji">{meta.emoji}</span>
          <h1>{meta.label} Books</h1>
          <p>{books.length} books to dive into</p>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="book-loading">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
          <p>Finding great reads for you...</p>
        </div>
      ) : (
        <div className="books-section">
          <div className="books-grid">
            {books.map(book => (
              <BookCard
                key={book.id}
                book={book}
                likedBooks={likedBooks}
                savedBooks={savedBooks}
                onLike={setLikedBooks}
                onSave={setSavedBooks}
                onShowDetails={handleShowDetails}
              />
            ))}
          </div>
        </div>
      )}

      {showDetails && selectedBook && (
        <BookDetails
          book={selectedBook}
          onClose={() => { setShowDetails(false); setSelectedBook(null); }}
        />
      )}
    </div>
  );
};

export default BookPlaylist;