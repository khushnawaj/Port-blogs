import { useEffect, useState } from "react";
import axios from "axios";
import "./Projects.scss";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    image: "",
    liveUrl: "",
    sourceUrl: "",
  });

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects");
        // controller should return { success, data }
        setProjects(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // assumes login sets this
      const res = await axios.post(
        "http://localhost:5000/api/projects",
        {
          ...formData,
          technologies: formData.technologies
            .split(",")
            .map((tech) => tech.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProjects([...projects, res.data]); // add new project to list
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        technologies: "",
        image: "",
        liveUrl: "",
        sourceUrl: "",
      });
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project. Check console for details.");
    }
  };

  if (loading) {
    return (
      <div className="projects">
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="projects">
      <div className="projects-header">
        <h1>My Projects</h1>
        <p>
          Explore my recent work showcasing modern web development solutions and
          design principles.
        </p>
        <button className="create-btn" onClick={() => setShowModal(true)}>
          + Create Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p>No projects available.</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="projects-card">
              <div className="projects-card-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="projects-card-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="tech-list">
                  {project.technologies?.map((tech, index) => (
                    <span key={index}>{tech}</span>
                  ))}
                </div>

                <div className="projects-card-actions">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="demo"
                    >
                      Live Demo
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="code"
                    >
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Project</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Project Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="technologies"
                placeholder="Technologies (comma separated)"
                value={formData.technologies}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
              />
              <input
                type="text"
                name="liveUrl"
                placeholder="Live Demo URL"
                value={formData.liveUrl}
                onChange={handleChange}
              />
              <input
                type="text"
                name="sourceUrl"
                placeholder="Source Code URL"
                value={formData.sourceUrl}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
