import React, { useState, useEffect } from "react";
import './Step4Projects.scss';
import { FiPlus, FiTrash2, FiGithub, FiLink } from "react-icons/fi";

const Step4Projects = ({ data, handleChange, nextStep, prevStep }) => {
  // Ensure data is an array
  const projects = Array.isArray(data) ? data : [];

  const updateProject = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    handleChange("projects", null, updatedProjects);
  };

  const updateTechStack = (index, value) => {
    const updatedProjects = [...projects];
    // Split by comma and trim
    const stack = value.split(',').map(item => item.trim());
    updatedProjects[index] = { ...updatedProjects[index], techStack: stack };
    handleChange("projects", null, updatedProjects);
  };

  const addProject = () => {
    const newProject = { title: "", description: "", link: "", techStack: [] };
    handleChange("projects", null, [...projects, newProject]);
  };

  const removeProject = (index) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    handleChange("projects", null, updatedProjects);
  };

  return (
    <div className="step4-projects">
      <h2>Let's Showcase Your Work</h2>
      <p className="subtitle">Add your best projects here.</p>

      <div className="projects-container">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="card-header">
              <h3>Project {index + 1}</h3>
              {projects.length > 1 && (
                <button
                  className="delete-btn"
                  onClick={() => removeProject(index)}
                  title="Delete Project"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>

            <div className="form-group">
              <label>Project Title</label>
              <input
                type="text"
                value={project.title || ""}
                onChange={(e) => updateProject(index, "title", e.target.value)}
                placeholder="e.g. E-Commerce Platform"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={project.description || ""}
                onChange={(e) => updateProject(index, "description", e.target.value)}
                placeholder="Briefly describe what you built..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Tech Stack (comma separated)</label>
              <input
                type="text"
                value={project.techStack?.join(", ") || ""}
                onChange={(e) => updateTechStack(index, e.target.value)}
                placeholder="e.g. React, Node.js, MongoDB"
              />
            </div>

            <div className="form-group">
              <label>Project Link</label>
              <div className="input-with-icon">
                <FiLink />
                <input
                  type="text"
                  value={project.link || ""}
                  onChange={(e) => updateProject(index, "link", e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-btn" onClick={addProject}>
        <FiPlus /> Add Another Project
      </button>
    </div>
  );
};

export default Step4Projects;
