// spotifyfetch.js - now using Last.fm API
const axios = require('axios');

const emotionMap = {
  happy: {
    seed_genres: 'jazz',
    limit: 10,
    market: 'US'
  },
  sad: {
    seed_genres: 'blues,soul',
    target_valence: 0.3,
    target_acousticness: 0.7,
    max_tempo: 90
  },
  angry: {
    seed_genres: 'rock,metal',
    target_energy: 0.8,
    target_loudness: -3,
    min_danceability: 0.6
  },
  surprise: {
    seed_genres: 'classical,jazz',
    target_danceability: 0.7,
    target_liveness: 0.6,
    target_key: '5'
  },
  neutral: {
    seed_genres: 'classical,lo-fi',
    target_instrumentalness: 0.6,
    target_tempo: 100,
    target_valence: 0.5
  }
};

async function getRecommendations(req, res) {
  // Get the mood from the query parameter; default to "neutral" if not provided.
  const emotion = req.query.mood || 'neutral';
  
  try {
    const apiKey = process.env.LASTFM_API_KEY; // Make sure to set this in .env
    const url = 'http://ws.audioscrobbler.com/2.0/';
    
    // Build parameters for Last.fm request. For demonstration, we use the mood tag directly.
    const response = await axios.get(url, {
      params: {
        method: 'tag.gettoptracks',
        tag: emotion, // e.g., "pop", "happy", "rock" etc.
        api_key: apiKey,
        format: 'json',
        limit: 10
      },
      timeout: 10000
    });
    
    // Log the raw response for debugging
    console.log("Raw Last.fm response:", JSON.stringify(response.data, null, 2));

    // Check if tracks are available in response
    if (!response.data.tracks || !response.data.tracks.track || response.data.tracks.track.length === 0) {
      return res.status(404).json({ error: 'No tracks found for this mood' });
    }
    
    // Map each track to a common format.
    const tracks = response.data.tracks.track.map(track => ({
      title: track.name,
      artist: track.artist.name,
      url: track.url,
      // There is an array of images; pick one with size "extralarge", or fallback:
      image: (track.image.find(img => img.size === 'extralarge') || {})['#text'] || 'default-image-url.jpg'
    }));
    
    return res.json({ tracks });
  } catch (error) {
    console.error('Error fetching tracks from Last.fm:', error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}

module.exports = { getRecommendations };