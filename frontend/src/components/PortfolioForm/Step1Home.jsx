import React, { useState } from "react";
import './Step1Home.scss';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { FiUpload, FiImage } from "react-icons/fi";

const Step1Home = ({ data, handleChange }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(data.profileImage || "");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await api.post('/portfolio/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Update data with backend path
      handleChange("home", "profileImage", res.data.data);
      toast.success("Image uploaded!");
    } catch (err) {
      console.error(err);
      toast.error('Image upload failed');
      // Revert preview if failed
      setPreview(data.profileImage || "");
    } finally {
      setUploading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="step1-home">
      <h2>Step 1: Introduction</h2>
      <p className="subtitle">Start with your basic details.</p>

      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="e.g. John Doe"
          value={data.fullName}
          onChange={(e) => handleChange("home", "fullName", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Tagline</label>
        <input
          type="text"
          placeholder="e.g. Full Stack Developer | UI Designer"
          value={data.tagline}
          onChange={(e) => handleChange("home", "tagline", e.target.value)}
        />
      </div>

      <div className="form-group upload-group">
        <label>Profile Image</label>
        <div className="image-upload-container">
          <div className="image-preview">
            {preview ? (
              <img src={getImageUrl(preview)} alt="Profile Preview" />
            ) : (
              <div className="placeholder">
                <FiImage />
                <span>No Image</span>
              </div>
            )}
          </div>

          <div className="upload-controls">
            <label htmlFor="profile-upload" className={`upload-btn ${uploading ? 'disabled' : ''}`}>
              <FiUpload /> {uploading ? "Uploading..." : "Upload Photo"}
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              hidden
            />
            <p className="hint">Recommended: Square JPG/PNG, max 2MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1Home;
