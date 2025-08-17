import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi';
import './Footer.scss';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-brand">
          <span className="logo">Portfolio</span>
          <p>
            Creating exceptional digital experiences with modern web technologies 
            and thoughtful design.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="GitHub"><FiGithub /></a>
            <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
          </div>
        </div>

        {/* Navigation Column */}
        <div className="footer-nav">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-contact">
          <h3>Get In Touch</h3>
          <a href="mailto:hello@example.com" className="email">
            <FiMail /> khushnawaj14@gmail.com
          </a>
          <p>Open for collaborations and interesting projects.</p>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {currentYear} My Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}