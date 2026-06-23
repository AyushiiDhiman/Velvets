# Velvets 🎵📚
https://velvets-ten.vercel.app 

A full-stack mood-based music and book recommendation application built with the MERN stack. Discover songs and books that match your emotional vibe.

## Features

🎵 **Music Module**
- 6 mood-based playlists (Happy, Sad, Cherished, Broken, Focused, Motivation)
- Real YouTube music playback (full songs)
- Bollywood + Hollywood mixed catalog
- AI-powered personalized picks based on your preferences
- Like, save, and create custom playlists

📚 **Books Module**
- 4 book categories (Self-Help, Sci-Fi, Thriller, Bestsellers)
- 60+ carefully curated books with ratings
- Goodreads integration for deeper reading
- Save and like functionality
- Personalized recommendations

🔐 **Authentication & User Management**
- JWT-based authentication
- Secure password encryption (bcryptjs)
- User profiles with saved preferences
- Persistent data storage

## Tech Stack

**Frontend:** React.js, Axios, React Router, React Toastify
**Backend:** Node.js, Express.js, MongoDB, JWT
**Database:** MongoDB Atlas
**External APIs:** YouTube Search API, Spotify API concepts
**Styling:** CSS3 with responsive design

## Project Structure
velvets/

├── frontend/           # React application

│   ├── src/

│   │   ├── pages/     # MoodSelect, Playlist, Library, BookSelect, BookPlaylist

│   │   ├── components/ # SongCard, BookCard, PlayerModal, Navbar

│   │   └── context/   # Authentication context

├── backend/           # Express server

│   ├── routes/        # Auth, Songs, Books, Playlists

│   ├── models/        # User schema, Book schema

│   └── middleware/    # JWT authentication

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- YouTube & Spotify API keys (optional for enhanced features)

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/velvets.git
cd velvets

# Backend setup
cd backend
npm install
# Create .env file with MongoDB URI and JWT secret
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
npm start
```

## Key Features Explained

- **Mood-Based Discovery:** Select your current mood and get instantly curated content
- **AI Personalization:** Recommendations learn from your likes and saves
- **Dual Content:** Music for immediate emotional resonance + Books for deeper exploration
- **Beautiful UI:** Premium aesthetic with pink/rose-gold color scheme

## Learning Outcomes

- Full-stack MERN development
- JWT authentication & security
- External API integration
- Database design & MongoDB
- Responsive UI/UX design
- State management & React hooks
- REST API design principles

## Future Enhancements

- Deploy on Vercel + Railway
- Android app version
- Advanced ML recommendations
- Social sharing features
- User playlists collaboration

## License

MIT License - feel free to use this project as a reference

---

**Built with 💛 by Ayushi**
