const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const imageControl = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Create form data for Face++ API call
    const form = new FormData();
    // Pass the original file name explicitly as the third argument.
    form.append('image_file', fs.createReadStream(filePath), req.file.originalname);
    form.append('api_key', process.env.FACEPP_API_KEY);       // Set in your .env file
    form.append('api_secret', process.env.FACEPP_API_SECRET);   // Set in your .env file
    form.append('return_attributes', 'emotion'); // Request emotion attributes

    // Face++ API endpoint (adjust region if needed)
    const faceApiEndpoint = 'https://api-us.faceplusplus.com/facepp/v3/detect';

    const response = await axios.post(faceApiEndpoint, form, {
      headers: form.getHeaders()
    });

    // Remove the temporary file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    // Process the response data from Face++ API
    const data = response.data;
    console.log("Face++ response data:", data);

    // Check if faces are detected
    if (data.faces && data.faces.length > 0) {
      const emotions = data.faces[0].attributes.emotion;
      // Determine the dominant emotion
      const dominantEmotion = Object.keys(emotions).reduce(
        (prev, curr) => (emotions[prev] > emotions[curr] ? prev : curr)
      );

      // Return the detected mood and emotion scores to the frontend
      return res.json({ mood: dominantEmotion, emotionScores: emotions });
    } else {
      return res.status(404).json({ error: "No faces detected" });
    }
  } catch (error) {
    console.error("Error in imageControl:", error);
    return res.status(500).json({ error: 'Error processing image' });
  }
};

module.exports = {
  imageControl,
};
