import React from "react";
import './Step5Contact.scss';
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiTwitter, FiGlobe } from 'react-icons/fi';

const Step5Contact = ({ data, handleChange }) => {
  return (
    <div className="step5-contact">
      <h2>Step 5: Contact Information</h2>
      <p className="subtitle">Let people know how to reach you</p>

      <div className="contact-fields">
        <div className="input-group">
          <FiMail className="input-icon" />
          <input
            type="email"
            placeholder="Email Address"
            value={data.email || ""}
            onChange={(e) => handleChange("contact", "email", e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiPhone className="input-icon" />
          <input
            type="text"
            placeholder="Phone Number"
            value={data.phone || ""}
            onChange={(e) => handleChange("contact", "phone", e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiLinkedin className="input-icon" />
          <input
            type="text"
            placeholder="LinkedIn Profile URL"
            value={data.linkedin || ""}
            onChange={(e) => handleChange("contact", "linkedin", e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiGithub className="input-icon" />
          <input
            type="text"
            placeholder="GitHub Profile URL"
            value={data.github || ""}
            onChange={(e) => handleChange("contact", "github", e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiTwitter className="input-icon" />
          <input
            type="text"
            placeholder="Twitter Profile URL"
            value={data.twitter || ""}
            onChange={(e) => handleChange("contact", "twitter", e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiGlobe className="input-icon" />
          <input
            type="text"
            placeholder="Personal Website URL"
            value={data.website || ""}
            onChange={(e) => handleChange("contact", "website", e.target.value)}
          />
        </div>
      </div>

      <div className="completion-message">
        <p>✨ You're all set! Click "Submit" to save your portfolio.</p>
      </div>
    </div>
  );
};

export default Step5Contact;
