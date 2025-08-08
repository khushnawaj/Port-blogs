export default function Projects() {
  const projects = [
    { id: 1, title: "E-Commerce App", description: "Built with React & Node.js" },
    { id: 2, title: "Portfolio Website", description: "Built with React & Vite" },
  ];

  return (
    <div className="projects">
      <h2>My Projects</h2>
      <div className="project-list">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}