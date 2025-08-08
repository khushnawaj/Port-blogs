import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} My Portfolio</p>
      </div>
    </footer>
  );
};

export default Footer;