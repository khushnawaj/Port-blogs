import { useState, useEffect } from 'react';
import { FiMail, FiMapPin, FiPhone, FiGithub, FiTwitter, FiGlobe } from 'react-icons/fi';
import './Contacts.scss';
import { useAuth } from '../contexts/AuthContext';
import { getMyPortfolio } from '../services/portfolioServices';

export default function Contact() {
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  const isPersonalized = currentUser && portfolio;
  const contactInfo = isPersonalized ? portfolio.contact : {};

  return (
    <div className="contact">
      <div className="contact-container">
        {/* Contact Information */}
        <div className="contact-info">
          <h1>{isPersonalized ? `Contact ${portfolio.home.fullName}` : "Get In Touch"}</h1>
          <p>
            {isPersonalized
              ? "Feel free to reach out through the form or directly via my contact details below."
              : "Have a project in mind or want to discuss potential opportunities? Feel free to reach out."}
          </p>

          <div className="contact-info-details">
            <div>
              <FiMail />
              <a href={`mailto:${contactInfo.email || "hello@example.com"}`}>
                {contactInfo.email || "hello@example.com"}
              </a>
            </div>
            {contactInfo.phone && (
              <div>
                <FiPhone />
                <a href={`tel:${contactInfo.phone}`}>
                  {contactInfo.phone}
                </a>
              </div>
            )}
            {!isPersonalized && (
              <div>
                <FiPhone />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </div>
            )}

            <div>
              <FiMapPin />
              <span>{isPersonalized ? "Remote / Available Worldwide" : "San Francisco, CA"}</span>
            </div>

            {/* Social Links if personalized */}
            {isPersonalized && (
              <div className="social-links" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                {contactInfo.github && (
                  <a href={contactInfo.github} target="_blank" rel="noreferrer" title="GitHub">
                    <FiGithub size={24} />
                  </a>
                )}
                {contactInfo.twitter && (
                  <a href={contactInfo.twitter} target="_blank" rel="noreferrer" title="Twitter">
                    <FiTwitter size={24} />
                  </a>
                )}
                {contactInfo.website && (
                  <a href={contactInfo.website} target="_blank" rel="noreferrer" title="Website">
                    <FiGlobe size={24} />
                  </a>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Contact Form */}
        {isSubmitted ? (
          <div className="contact-success">
            <h2>Thank You!</h2>
            <p>Your message has been sent successfully. I'll get back to you soon.</p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn btn-primary"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}