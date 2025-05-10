import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import {menuCategories} from "../menuData";
import {useCart} from "../context/CartContext";

export const specialsData = [
    menuCategories[0].items[0],
    menuCategories[1].items[0],
    menuCategories[2].items[0],
];

const CallToAction = () => {
    return (
        <section className="hero-section" aria-labelledby="hero-main-title">
            <div className="hero-content container">
                <div className="hero-text">
                    <h1 id="hero-main-title" className="hero-title-main">Little Lemon</h1>
                    <h2 className="hero-subtitle">Chicago</h2>
                    <p className="hero-description">
                        We are a family-owned Mediterranean restaurant, focused on traditional
                        recipes served with a modern twist. Join us for an unforgettable dining experience.
                    </p>
                    <Link to="/booking" className="cta-button hero-cta-button" aria-label="Reserve a Table at Little Lemon">
                        Reserve a Table
                    </Link>
                </div>
                <div className="hero-image-container">
                    <img
                        src="https://images.unsplash.com/photo-1666633050341-5580de071aed?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Delicious food platter at Little Lemon"
                        className="hero-image"
                    />
                </div>
            </div>
        </section>
    );
};

const SpecialsSection = () => {
    const { addItemToCart } = useCart();

    const handleAddItemToCart = (item) => {
        addItemToCart(item);
        alert(`${item.name} has been added to your basket!`); // Simple user feedback
    };

    return <section className="specials-section container" aria-labelledby="specials-heading">
        <div className="specials-header">
            <h2 id="specials-heading">This Week's Specials!</h2>
            <Link to="/menu" className="cta-button menu-promo-button">Online Menu</Link>
        </div>
        <div className="specials-grid">
            {specialsData.map((special) => (
                <article key={special.id} className="special-card" aria-labelledby={`special-title-${special.id}`}>
                    <img src={special.image} alt={special.name} className="special-image" />
                    <div className="special-card-content">
                        <div className="special-card-header">
                            <h3 id={`special-title-${special.id}`}>{special.name}</h3>
                            <p className="price">{special.price}</p>
                        </div>
                        <p className="special-description">{special.description}</p>
                        <button
                            onClick={() => handleAddItemToCart(special)}
                            className="add-to-basket-button cta-button"
                            aria-label={`Add ${special.name} to basket`}
                        >
                            Add to Basket
                        </button>
                    </div>
                </article>
            ))}
        </div>
    </section>
    };

// Dummy Testimonials Data with Unsplash profile images
const testimonialsData = [
    {
        id: 't1',
        name: 'Sarah K.',
        rating: 5,
        review: "Absolutely loved the food and the atmosphere! The Greek Salad was the best I've ever had.",
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 't2',
        name: 'John B.',
        rating: 4,
        review: "Great place for a family dinner. The Bruschetta was amazing. Service was a bit slow but friendly.",
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
        id: 't3',
        name: 'Emily L.',
        rating: 5,
        review: "The Lemon Dessert is to die for! Such a cozy and welcoming restaurant. Highly recommend!",
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
];

const TestimonialsSection = () => (
    <section className="testimonials-section" aria-labelledby="testimonials-heading">
        <div className="testimonials-background">
            <div className="container">
                <h2 id="testimonials-heading">What Our Customers Say!</h2>
                <div className="testimonials-grid">
                    {testimonialsData.map(testimonial => (
                        <article key={testimonial.id} className="testimonial-card" aria-label={`Testimonial from ${testimonial.name}`}>
                            <div className="testimonial-rating">{'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}</div>
                            <div className="testimonial-customer">
                                <img src={testimonial.image} alt={`${testimonial.name}`} className="testimonial-image" />
                                <p className="testimonial-name">{testimonial.name}</p>
                            </div>
                            <blockquote className="testimonial-review">
                                <p>"{testimonial.review}"</p>
                            </blockquote>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    </section>
);


const AboutSummarySection = () => (
    <section className="about-summary-section container" aria-labelledby="about-summary-heading">
        <div className="about-summary-content">
            <div className="about-summary-text">
                <h2 id="about-summary-heading">Little Lemon</h2>
                <h3 className="about-summary-subtitle">Chicago</h3>
                <p>
                    Little Lemon is a charming neighborhood bistro that serves simple food and classic cocktails
                    in a lively but casual environment. The restaurant features a locally-sourced menu with daily specials.
                    We are passionate about providing a unique Mediterranean dining experience with a focus on fresh ingredients and warm hospitality.
                </p>
                <Link to="/about" className="cta-button learn-more-button">Learn More About Us</Link>
            </div>
            <div className="about-summary-images">
                <img
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                    alt="Chef preparing food"
                    className="about-image-1"
                />
                <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                    alt="Little Lemon restaurant interior"
                    className="about-image-2"
                />
            </div>
        </div>
    </section>
);


const HomePage = () => {
    return (
        <main id="main-content">
            <CallToAction />
            <SpecialsSection />
            <TestimonialsSection />
            <AboutSummarySection />
        </main>
    );
};

export default HomePage;