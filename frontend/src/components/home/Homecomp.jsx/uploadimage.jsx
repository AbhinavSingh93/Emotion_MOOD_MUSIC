import React, { useState, useRef } from 'react';
import './UploadImage.css';

function UploadImage({ onImageSubmit, onClear, isLoading }){
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Handle file input (both for input and drag-and-drop)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG)');
      return;
    }
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 5MB limit');
      return;
    }
    setSelectedFile(file);
    createPreview(file);
  };

  // Create a preview from a file
  const createPreview = (file) => {
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  // Drag and drop functionality
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Mimic event for handleFileChange
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Submit function: upload the file
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile); // Must match backend key

    try {
      const response = await fetch('http://localhost:5000/uploadimage/image', {
        method: "POST",
        body: formData
      });
      const result = await response.json();
      // Call the parent callback with API response (which includes detected mood)
      onImageSubmit(result);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  // Trigger hidden file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Toggle camera and start video stream
  const startCamera = async () => {
    setIsCameraOn(true);
  };
  

  // Capture photo from video stream
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      // Stop camera after capture
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraOn(false);
      // Convert canvas image to blob then to File object
      canvas.toBlob(blob => {
        const file = new File([blob], 'captured_photo.png', { type: 'image/png' });
        setSelectedFile(file);
        createPreview(file);
      }, 'image/png');
    }
  };

  // Cancel camera capture
  const cancelCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOn(false);
  };

  React.useEffect(() => {
    const enableCamera = async () => {
      if (isCameraOn && videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        } catch (error) {
          console.error("Error accessing camera:", error);
          alert("Unable to access the camera");
        }
      }
    };
    enableCamera();
  }, [isCameraOn]);
  

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Your Photo</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="upload-input"
        />

        {/* Drag and Drop Zone */}
        {!previewUrl && !isCameraOn && (
          <div 
            onClick={triggerFileInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="upload-dropzone"
          >
            <div className="dropzone-content">
              <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="dropzone-text">Click or drag and drop to upload</p>
              <p className="dropzone-subtext">JPEG or PNG (Max 5MB)</p>
            </div>
          </div>
        )}

        {/* Camera Capture UI */}
        {isCameraOn && (
          <div className="camera-container">
            <video ref={videoRef} className="camera-video" autoPlay></video>
            <div className="camera-buttons">
              <button type="button" onClick={capturePhoto} className="camera-button primary-button">
                Capture Photo
              </button>
              <button type="button" onClick={cancelCamera} className="camera-button secondary-button">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Preview Display */}
        {previewUrl && (
          <div className="image-preview-container">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="image-preview"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl('');
                setSelectedFile(null);
                if (onClear) onClear(); 
              }}
              className="clear-preview-btn"
            >
              ✕
            </button>
          </div>
        )}

        <div className="upload-buttons">
          {!isCameraOn && (
            <>
              <button
                type="button"
                onClick={triggerFileInput}
                className="secondary-button"
              >
                {previewUrl ? 'Change Image' : 'Select Image'}
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="secondary-button"
              >
                Take Photo
              </button>
            </>
          )}
          
          <button
            type="submit"
            disabled={!selectedFile || isLoading}
            className={`primary-button ${(!selectedFile || isLoading) ? 'disabled-button' : ''}`}
          >
            {isLoading ? 'Analyzing...' : 'Analyze Mood'}
          </button>
        </div>
      </form>

      {/* Hidden canvas for capturing photo */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}

export default UploadImage;
