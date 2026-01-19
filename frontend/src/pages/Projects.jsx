import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Projects.scss";
import { useAuth } from "../contexts/AuthContext";
import { getMyPortfolio } from "../services/portfolioServices";

export default function Projects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from Portfolio
  useEffect(() => {
    const fetchProjects = async () => {
      if (currentUser) {
        try {
          const res = await getMyPortfolio();
          if (res.data && res.data.projects) {
            setProjects(res.data.projects);
          }
        } catch (err) {
          console.error("Error fetching portfolio projects:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [currentUser]);

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
        <h1>{currentUser ? "My Projects" : "Projects"}</h1>
        <p>
          {currentUser
            ? "Here are the projects you've added to your portfolio."
            : "Explore recent work showcasing modern web development solutions."}
        </p>

        {currentUser && (
          <Link to="/portfolio-builder" className="create-btn">
            Manage Projects / Add New
          </Link>
        )}
      </div>

      <div className="projects-grid">
        {!currentUser ? (
          <div className="empty-state">
            <p>Please <Link to="/login">login</Link> to view your projects.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>No projects found in your portfolio.</p>
            <Link to="/portfolio-builder">Add your first project</Link>
          </div>
        ) : (
          projects.map((project, index) => (
            <div key={index} className="projects-card">
              {/* Fallback image or project.image if exists in schema (Step 4 didn't used to have image, but model might) */}
              <div className="projects-card-image">
                {/* Only show image div if image exists or use placeholder pattern */}
                <div className="placeholder-image" style={{ background: '#f0f0f0', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                  {project.title} Preview
                </div>
              </div>
              <div className="projects-card-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>

                <div className="tech-list">
                  {project.techStack?.map((tech, i) => (
                    <span key={i}>{tech}</span>
                  ))}
                </div>

                <div className="projects-card-actions">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="demo"
                    >
                      View Project
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
