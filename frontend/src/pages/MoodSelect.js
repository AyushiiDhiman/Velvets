import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AIPicks from '../components/AIPicks';
import './MoodSelect.css';

const moods = [
  { key: 'happy',      emoji: '🌟', label: 'Happy',      desc: 'Bright & feel-good vibes',   color: '#FFD6A5' },
  { key: 'sad',        emoji: '🌧️', label: 'Sad',        desc: 'Let it all out, it\'s okay',  color: '#C9D6FF' },
  { key: 'cherished',   emoji: '🌹', label: 'cherished',   desc: 'Soft love & tender moments',  color: '#FFB3C6' },
  { key: 'broken',     emoji: '💔', label: 'Broken',     desc: 'Healing one song at a time',  color: '#E2CFEA' },
  { key: 'focused',    emoji: '🎯', label: 'Focused',    desc: 'Deep work & clear mind',      color: '#B5EAD7' },
  { key: 'motivation', emoji: '🔥', label: 'Motivation', desc: 'Rise up & conquer the day',   color: '#FFDAC1' },
];

const MoodSelect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mood-page">
      <div className="mood-hero">
        <h1>How are you feeling,<br /><span>{user?.name?.split(' ')[0]}?</span></h1>
        <p>Pick your mood and let Velvets curate the perfect playlist for you ✨</p>
      </div>

      <div className="mood-grid">
        {moods.map(mood => (
          <button
            key={mood.key}
            className="mood-card"
            style={{ '--mood-color': mood.color }}
            onClick={() => navigate(`/playlist/${mood.key}`)}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <h3>{mood.label}</h3>
            <p>{mood.desc}</p>
            <div className="mood-arrow">→</div>
          </button>
        ))}
      </div>

      <AIPicks />
    </div>
  );
};

export default MoodSelect;
