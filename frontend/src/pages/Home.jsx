import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './home.scss';
import Button from '../components/Button';
import heroImage from '../assets/hero1.jpg';
import { useAuth } from '../contexts/AuthContext';
import { getMyPortfolio } from '../services/portfolioServices';

export default function Home() {
  const { currentUser } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch portfolio if logged in
  useEffect(() => {
    const loadPortfolio = async () => {
      if (currentUser) {
        setLoading(true);
        try {
          const res = await getMyPortfolio();
          if (res.data) {
            setPortfolio(res.data);
          }
        } catch (err) {
          console.log("No portfolio found or error:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    loadPortfolio();
  }, [currentUser]);

  // Scroll animation trigger
  useEffect(() => {
    const elements = document.querySelectorAll('.home-content, .home-image');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getImageUrl = (url) => {
    if (!url) return heroImage;
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url}`;
  };

  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-content">
          {currentUser && portfolio ? (
            // Personalized View
            <>
              <span className="welcome-badge">Welcome back!</span>
              <h1>{portfolio.home.fullName}</h1>
              <h2 className="tagline">{portfolio.home.tagline}</h2>
              <p>
                {portfolio.about.bio || "Crafting immersive web solutions with cutting-edge technology and innovative design."}
              </p>
              <div className="home-cta">
                <Link to={`/portfolio/${portfolio.userId}`}>
                  <Button variant="primary">View My Portfolio</Button>
                </Link>
                <Link to="/portfolio-builder">
                  <Button variant="outline">Edit Portfolio</Button>
                </Link>
              </div>
            </>
          ) : currentUser && !loading ? (
            // Logged in but no portfolio
            <>
              <h1>Welcome, {currentUser.username}!</h1>
              <p>You haven't created your portfolio yet. Start building your professional presence today.</p>
              <div className="home-cta">
                <Link to="/portfolio-builder">
                  <Button variant="primary">Create Portfolio</Button>
                </Link>
              </div>
            </>
          ) : (
            // Guest View
            <>
              <h1>Transform Ideas Into Digital Experiences</h1>
              <p>
                Crafting immersive web solutions with cutting-edge technology and
                innovative design to elevate your digital presence.
              </p>
              <div className="home-cta">
                <Link to="/projects">
                  <Button variant="primary">View Projects</Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="home-image">
          <img
            src={currentUser && portfolio && portfolio.home.profileImage ? getImageUrl(portfolio.home.profileImage) : heroImage}
            alt="Hero"
            loading="lazy"
            className={portfolio ? 'profile-mode' : ''}
          />
        </div>
      </div>
    </div>
  );
}