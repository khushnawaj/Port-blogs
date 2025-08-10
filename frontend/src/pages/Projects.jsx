import './Projects.scss';
import project1 from '../assets/e-com.jpg'; // Add your images
import project2 from '../assets/e-learning.jpg';
import project3 from '../assets/task1.jpg';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-featured online store with payment integration and inventory management.",
      image: project1,
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      demoUrl: "#",
      codeUrl: "#"
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "A responsive portfolio site with blog functionality and contact form.",
      image: project2,
      technologies: ["React", "SCSS", "Formik"],
      demoUrl: "#",
      codeUrl: "#"
    },
    {
      id: 3,
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates.",
      image: project3,
      technologies: ["React", "Firebase", "Redux"],
      demoUrl: "#",
      codeUrl: "#"
    }
  ];

  return (
    <div className="projects">
      <div className="projects-header">
        <h1>My Projects</h1>
        <p>Explore my recent work showcasing modern web development solutions and design principles.</p>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="projects-card">
            <div className="projects-card-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="projects-card-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              
              <div className="tech-list">
                {project.technologies.map((tech, index) => (
                  <span key={index}>{tech}</span>
                ))}
              </div>

              <div className="projects-card-actions">
                <a href={project.demoUrl} className="demo">Live Demo</a>
                <a href={project.codeUrl} className="code">View Code</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}