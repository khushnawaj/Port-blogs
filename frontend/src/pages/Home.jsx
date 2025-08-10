import { useEffect } from 'react';
import './home.scss';
import Button from '../components/Button';
import heroImage from '../assets/hero1.jpg'; // Add your image

export default function Home() {
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

  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-content">
          <h1>Transform Ideas Into Digital Experiences</h1>
          <p>
            Crafting immersive web solutions with cutting-edge technology and 
            innovative design to elevate your digital presence.
          </p>
          <div className="home-cta">
            <Button variant="primary">View Projects</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
        
        <div className="home-image">
          <img 
            src={heroImage} 
            alt="Creative web development" 
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}