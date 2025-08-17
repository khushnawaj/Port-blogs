import './About.scss';
import profileImage from '../assets/profile-2.jpg'; 
import { FiCode, FiDatabase, FiLayers } from 'react-icons/fi';

export default function About() {
  const skills = {
    "Frontend": ["React", "JavaScript", "HTML/CSS", "Responsive Design"],
    "Backend": ["Node.js", "Express", "MongoDB", "REST APIs"],
    "Tools": ["Git", "VS Code", "Figma", "Webpack"]
  };

  return (
    <div className="about">
      <section className="about-hero">
        <div className="about-image">
          <img 
            src={profileImage} 
            alt="Profile" 
            loading="lazy"
          />
        </div>

        <div className="about-content">
          <h1>About Me</h1>
          <p>
            I'm a passionate full-stack developer with 5+ years of experience creating 
            modern web applications. My approach combines technical expertise with 
            thoughtful design to deliver exceptional user experiences.
          </p>
          <p>
            Specializing in the MERN stack, I bridge the gap between frontend aesthetics 
            and backend functionality. When I'm not coding, you'll find me contributing 
            to open-source projects or exploring new technologies.
          </p>
        </div>
      </section>

      <section className="about-skills">
        <div className="about-skills-container">
          <h2>My Skills</h2>
          <div className="about-skills-grid">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="about-skills-category">
                <h3>
                  {category === "Frontend" && <FiLayers />}
                  {category === "Backend" && <FiDatabase />}
                  {category === "Tools" && <FiCode />}
                  {category}
                </h3>
                <ul>
                  {items.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>Want to work together?</h2>
        <a href="/contact" className="btn btn-primary">Get In Touch</a>
      </section>
    </div>
  );
}