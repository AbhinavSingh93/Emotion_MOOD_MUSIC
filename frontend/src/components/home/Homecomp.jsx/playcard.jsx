// PlayCards.js
import React from 'react';
import './PlayCards.css'; // Create and style this CSS file as desired

function PlayCards({ mood, tracks }) {
  return (
    <div className="playcards-container">
      <h2 className="playcards-title">
        Music for {mood.charAt(0).toUpperCase() + mood.slice(1)}
      </h2>
      <div className="playcards-grid">
        {tracks.map((track, index) => (
          <div key={index} className="playcard">
            <img 
              src={track.image} 
              alt={track.title} 
              className="playcard-image" 
            />
            <div className="playcard-info">
              <h3 className="playcard-title">{track.title}</h3>
              <p className="playcard-artist">{track.artist}</p>
              <a 
                href={track.url}  // Use the track URL returned from Last.fm API
                target="_blank" 
                rel="noopener noreferrer"
                className="playcard-link"
              >
                Play
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayCards;