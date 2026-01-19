import { useState, useEffect } from 'react';
import './About.scss';
import profileImage from '../assets/profile-2.jpg';
import { FiCode } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getMyPortfolio } from '../services/portfolioServices';

export default function About() {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      if (currentUser) {
        try {
          const res = await getMyPortfolio();
          if (res.data) setPortfolio(res.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    loadPortfolio();
  }, [currentUser]);

  const defaultSkills = {
    "Frontend": ["React", "JavaScript", "HTML/CSS", "Responsive Design"],
    "Backend": ["Node.js", "Express", "MongoDB", "REST APIs"],
    "Tools": ["Git", "VS Code", "Figma", "Webpack"]
  };

  const getImageUrl = (url) => {
    if (!url) return profileImage;
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  const isPersonalized = currentUser && portfolio;

  return (
    <div className="about">
      <section className="about-hero">
        <div className="about-image">
          <img
            src={isPersonalized && portfolio.home.profileImage ? getImageUrl(portfolio.home.profileImage) : profileImage}
            alt="Profile"
            loading="lazy"
            style={isPersonalized ? { objectFit: 'cover', borderRadius: '50%', aspectRatio: '1/1' } : {}}
          />
        </div>

        <div className="about-content">
          <h1>{isPersonalized ? `About ${portfolio.home.fullName}` : "About Me"}</h1>
          <p>
            {isPersonalized ? (portfolio.about.bio || "No bio available.") : (
              <>
                I'm a passionate full-stack developer with 5+ years of experience creating
                modern web applications. My approach combines technical expertise with
                thoughtful design to deliver exceptional user experiences.
              </>
            )}
          </p>
          {!isPersonalized && (
            <p>
              Specializing in the MERN stack, I bridge the gap between frontend aesthetics
              and backend functionality. When I'm not coding, you'll find me contributing
              to open-source projects or exploring new technologies.
            </p>
          )}
        </div>
      </section>

      <section className="about-skills">
        <div className="about-skills-container">
          <h2>My Skills</h2>
          {isPersonalized && portfolio.about.skills ? (
            <div className="about-skills-grid">
              <div className="about-skills-category">
                <h3><FiCode /> All Skills</h3>
                <ul>
                  {portfolio.about.skills.map(skill => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="about-skills-grid">
              {Object.entries(defaultSkills).map(([category, items]) => (
                <div key={category} className="about-skills-category">
                  <h3>{category}</h3>
                  <ul>
                    {items.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="about-cta">
        <h2>Want to work together?</h2>
        <a href="/contact" className="btn btn-primary">Get In Touch</a>
      </section>
    </div>
  );
}