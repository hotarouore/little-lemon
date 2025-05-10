import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer" aria-label="Footer">
            <div className="footer-content container">
                <div className="footer-section logo-section">
                    <img src='https://meta-capstone-little-lemon.web.app/static/media/secondaryLogo.2c859235d6c57bb54176.png' alt="Little Lemon logo" className="footer-logo-img" />
                    <p className="footer-tagline">Authentic Mediterranean cuisine since 2023.</p>
                </div>

                <div className="footer-section links-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/menu">Menu</Link></li>
                        <li><Link to="/booking">Reservations</Link></li>
                        <li><Link to="/order-online">Order Online</Link></li>
                        <li><Link to="/login">Login/Sign Up</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact-section">
                    <h4>Contact Us</h4>
                    <address>
                        123 Lemon Grove Lane<br />
                        Chicago, Illinois, 60602<br />
                        USA
                    </address>
                    <p><a href="tel:+13125550199">(312) 555-0199</a></p>
                    <p><a href="mailto:info@littlelemon.com">info@littlelemon.com</a></p>
                </div>

                <div className="footer-section social-section">
                    <h4>Follow Us</h4>
                    <ul>
                        <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                        <li><a href="https://www.tripadvisor.com" target="_blank" rel="noopener noreferrer">TripAdvisor</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Little Lemon Restaurant. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
