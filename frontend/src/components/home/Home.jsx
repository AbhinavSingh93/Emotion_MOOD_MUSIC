import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';
import UploadImage from './Homecomp.jsx/uploadimage';
import PlayCards from './Homecomp.jsx/playcard';
import './Home.css';


function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [moodData, setMoodData] = useState(null); // To store mood and emotion scores
  const [tracks, setTracks] = useState([]);         // Music recommendations
  const [isFetchingMusic, setIsFetchingMusic] = useState(false);
  const [showFullName, setShowFullName] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (!user) navigate('/login');
    setLoggedInUser(user);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged Out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const toggleNameDisplay = () => {
    setShowFullName(!showFullName);
  };

  // The callback passed to UploadImage component
  const handleImageSubmit = (result) => {
    console.log("Image submitted. Response:", result);
    setMoodData(result); // result should contain the detected mood and emotion scores
  };

  const handleClear = () => {
    setMoodData(null);   // Clear the detected mood
    setTracks([]);       // Clear the music cards
  };
  

  useEffect(() => {
    if (moodData && moodData.mood) {
      const fetchMusic = async () => {
        setIsFetchingMusic(true);
        try {
          const token = localStorage.getItem('token'); // Retrieve token from storage
          const response = await fetch(`http://localhost:5000/fetch/music?mood=${moodData.mood}`, {
            method: 'GET',
            headers: {
              'Authorization': token
            }
          });
          const data = await response.json();
          console.log("Music response:", data);
          setTracks(data.tracks);
        } catch (err) {
          handleError("Failed to fetch music recommendations");
        } finally {
          setIsFetchingMusic(false);
        }
      };

      fetchMusic();
    }
  }, [moodData]);

  return (
    <div className="home-container">
      {/* Header with user avatar and logout */}
      <header className="home-header">
        <div 
          className={`user-avatar ${showFullName ? 'expanded' : ''}`}
          onClick={toggleNameDisplay}
          title={loggedInUser}
        >
          {showFullName ? (
            <span className="full-name">{loggedInUser}</span>
          ) : (
            <span className="avatar-initial">
              {loggedInUser ? loggedInUser.charAt(0).toUpperCase() : 'U'}
            </span>
          )}
        </div>
        
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </header>

      {/* Main content area */}
      <main className="home-main">
        {/* Upload Image section */}
        <UploadImage onImageSubmit={handleImageSubmit}
         onClear={handleClear}
         isLoading={isFetchingMusic}
        />

        {/* Display detected mood if available */}
        {moodData && (
          <div className="mood-display">
            <h2>Detected Mood: {moodData.mood}</h2>
          </div>
        )}

      {/* While fetching music, you might show a loading indicator */}
      {isFetchingMusic && (
          <div className="music-loading">
            <p>Fetching music recommendations...</p>
          </div>
        )}

        {/* Display PlayCards if tracks are fetched */}
        {tracks.length > 0 && (
          <PlayCards mood={moodData.mood} tracks={tracks} />
        )}

      </main>

      <ToastContainer />
    </div>
  );
}

export default Home;
