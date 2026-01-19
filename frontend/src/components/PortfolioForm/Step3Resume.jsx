import React, { useState } from "react";
import './Step3Resume.scss';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const Step3Resume = ({ data, handleChange }) => {
  const [education, setEducation] = useState(data.education || []);
  const [experience, setExperience] = useState(data.experience || []);

  // Add new education entry
  const addEducation = () => {
    const newEducation = [...education, { school: "", degree: "", year: "" }];
    setEducation(newEducation);
    handleChange("resume", "education", newEducation);
  };

  // Remove education entry
  const removeEducation = (index) => {
    const newEducation = education.filter((_, i) => i !== index);
    setEducation(newEducation);
    handleChange("resume", "education", newEducation);
  };

  // Update education entry
  const updateEducation = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
    handleChange("resume", "education", newEducation);
  };

  // Add new experience entry
  const addExperience = () => {
    const newExperience = [...experience, { company: "", role: "", duration: "", details: "" }];
    setExperience(newExperience);
    handleChange("resume", "experience", newExperience);
  };

  // Remove experience entry
  const removeExperience = (index) => {
    const newExperience = experience.filter((_, i) => i !== index);
    setExperience(newExperience);
    handleChange("resume", "experience", newExperience);
  };

  // Update experience entry
  const updateExperience = (index, field, value) => {
    const newExperience = [...experience];
    newExperience[index][field] = value;
    setExperience(newExperience);
    handleChange("resume", "experience", newExperience);
  };

  return (
    <div className="step3-resume">
      <h2>Step 3: Resume</h2>

      {/* Education Section */}
      <div className="resume-section">
        <div className="section-header">
          <h3>Education</h3>
          <button type="button" className="add-btn" onClick={addEducation}>
            <FiPlus /> Add Education
          </button>
        </div>

        {education.length === 0 ? (
          <p className="empty-message">No education added yet. Click "Add Education" to get started.</p>
        ) : (
          education.map((edu, index) => (
            <div key={index} className="entry-card">
              <div className="entry-header">
                <h4>Education #{index + 1}</h4>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeEducation(index)}
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className="entry-fields">
                <input
                  type="text"
                  placeholder="School/University"
                  value={edu.school}
                  onChange={(e) => updateEducation(index, "school", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Year (e.g., 2020-2024)"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, "year", e.target.value)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Experience Section */}
      <div className="resume-section">
        <div className="section-header">
          <h3>Experience</h3>
          <button type="button" className="add-btn" onClick={addExperience}>
            <FiPlus /> Add Experience
          </button>
        </div>

        {experience.length === 0 ? (
          <p className="empty-message">No experience added yet. Click "Add Experience" to get started.</p>
        ) : (
          experience.map((exp, index) => (
            <div key={index} className="entry-card">
              <div className="entry-header">
                <h4>Experience #{index + 1}</h4>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeExperience(index)}
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className="entry-fields">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Role/Position"
                  value={exp.role}
                  onChange={(e) => updateExperience(index, "role", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., Jan 2020 - Present)"
                  value={exp.duration}
                  onChange={(e) => updateExperience(index, "duration", e.target.value)}
                />
                <textarea
                  placeholder="Details about your role and achievements"
                  value={exp.details}
                  onChange={(e) => updateExperience(index, "details", e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Step3Resume;
