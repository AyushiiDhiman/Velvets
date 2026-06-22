# 🎵 Velvets — Music for Every Mood

> A mood-based music app with a soft, feminine aesthetic. Pick your mood, get a curated playlist.

---

## ✨ Features

- **Login / Register** — JWT-based auth
- **6 Mood Playlists** — Happy, Sad, Romantic, Broken, Focused, Motivation
- **Like Songs** — Heart your favorites
- **Save Songs** — Bookmark songs to your library
- **Create Playlists** — Build your own collections
- **My Library** — View saved songs, liked songs & playlists
- **Spotify API ready** — Mock data now, plug in Spotify later

---

## 🛠 Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Frontend  | React, React Router, Axios    |
| Backend   | Node.js, Express              |
| Database  | MongoDB + Mongoose            |
| Auth      | JWT + bcryptjs                |
| Styling   | CSS Variables, Google Fonts   |

---

## 🚀 Setup & Run

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)

### 1. Backend
```bash
cd backend
npm install
# Edit .env with your MONGO_URI if needed
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

---

## 🎨 Color Palette

| Name       | Hex       |
|------------|-----------|
| Blush      | `#F9E4EC` |
| Rose       | `#E8A0BF` |
| Rose Gold  | `#C9848A` |
| Deep Rose  | `#A0526A` |
| Gold       | `#D4A574` |

---

## 🔮 Spotify Integration (Future)

1. Create a Spotify Developer app at [developer.spotify.com](https://developer.spotify.com)
2. Add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` to backend `.env`
3. Replace mock data in `backend/routes/songs.js` with Spotify API calls

---

## 📁 Project Structure

```
velvets/
├── backend/
│   ├── models/User.js
│   ├── routes/auth.js
│   ├── routes/songs.js
│   ├── routes/playlists.js
│   ├── middleware/auth.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── SongCard.js
        │   └── CreatePlaylistModal.js
        ├── context/AuthContext.js
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── MoodSelect.js
            ├── Playlist.js
            └── Library.js
```
