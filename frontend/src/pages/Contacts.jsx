import { useState } from 'react';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import './Contacts.scss';

export default function Contact() {
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

  return (
    <div className="contact">
      <div className="contact-container">
        {/* Contact Information */}
        <div className="contact-info">
          <h1>Get In Touch</h1>
          <p>
            Have a project in mind or want to discuss potential opportunities? 
            Feel free to reach out through the form or directly via my contact details.
          </p>

          <div className="contact-info-details">
            <div>
              <FiMail />
              <a href="mailto:hello@example.com">hello@example.com</a>
            </div>
            <div>
              <FiPhone />
              <a href="tel:+1234567890">+1 (234) 567-890</a>
            </div>
            <div>
              <FiMapPin />
              <span>San Francisco, CA</span>
            </div>
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