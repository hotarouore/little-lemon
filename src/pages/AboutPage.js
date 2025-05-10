import React from 'react';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const AboutPage = () => {
    return (
        <main className="content-page">
            <div className="container">
                <h1>About Little Lemon</h1>
                <section className="about-section">
                    <div className="about-text">
                        <h2>Our Story</h2>
                        <p>
                            Founded in the heart of Chicago in 2023 by two childhood friends, Mario and Adrian, Little Lemon was born from a shared dream. Mario, inspired by his Italian grandmother's traditional recipes, and Adrian, with his passion for modern culinary techniques learned while traveling the Mediterranean, decided to combine their talents. They envisioned a place where classic Mediterranean flavors meet contemporary flair, a place that feels both familiar and exciting.
                        </p>
                        <p>
                            What started as a humble eatery has quickly grown into a beloved neighborhood gem. We pride ourselves on using the freshest, locally-sourced ingredients whenever possible, crafting each dish with care and a deep respect for the culinary traditions that inspire us. From our hand-made pasta to our signature lemon-infused desserts, every bite tells a story of heritage and innovation.
                        </p>
                        <h2>Our Mission & Values</h2>
                        <p>
                            At Little Lemon, our mission is to create an unforgettable dining experience that delights the senses and warms the soul. We are committed to:
                        </p>
                        <ul>
                            <li><strong>Authenticity:</strong> Serving genuine Mediterranean dishes made with traditional methods and high-quality ingredients.</li>
                            <li><strong>Hospitality:</strong> Treating every guest like family, ensuring a warm, welcoming, and attentive service.</li>
                            <li><strong>Community:</strong> Being an active and positive presence in our Chicago neighborhood, supporting local suppliers and initiatives.</li>
                            <li><strong>Sustainability:</strong> Striving to minimize our environmental impact through responsible sourcing and waste reduction practices.</li>
                        </ul>
                        <p>
                            We invite you to join us at Little Lemon, to share a meal, create memories, and become part of our growing family. Whether it's a casual lunch, a celebratory dinner, or a quiet evening out, we're here to make your experience special.
                        </p>
                        <div style={{marginTop: '2rem', textAlign: 'center'}}>
                            <Link to="/booking" className="cta-button">Make a Reservation</Link>
                        </div>
                    </div>
                    <div className="about-image-container">
                        <img
                            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                            alt="Chefs Mario and Adrian in the Little Lemon kitchen"
                            style={{marginBottom: '1rem', border: '3px solid #F4CE14'}}
                        />
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AboutPage;