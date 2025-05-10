import React from 'react';
import { Link } from 'react-router-dom';
import './ContentPage.css';

const OrderOnlinePage = () => {
    return (
        <main className="content-page">
            <div className="container text-center">
                <h1>Order Online - Coming Soon!</h1>
                <p style={{fontSize: '1.2rem', color: '#555', maxWidth: '600px', margin: '1rem auto 2rem auto'}}>
                    We're cooking up something special for you! Our online ordering system
                    is currently under development and will be launching soon.
                </p>
                <p>
                    You'll be able to enjoy your favorite Little Lemon dishes from the comfort of your home
                    with just a few clicks. Expect easy Browse, secure payments, and timely delivery or pickup options.
                </p>
                <img
                    src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Illustration of online food ordering"
                    style={{maxWidth: '100%', height: 'auto', maxHeight: '350px', marginTop: '2rem', marginBottom: '2rem', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}
                />
                <h2>Stay Tuned!</h2>
                <p>
                    Follow us on social media or sign up for our newsletter to be the first to know when we go live.
                </p>
                <p>
                    In the meantime, you can explore our <Link to="/menu">full menu</Link> or
                    <Link to="/booking"> make a reservation</Link> to dine with us.
                    For takeaway orders, please call us directly at <a href="tel:+13125550199">(312) 555-0199</a>.
                </p>
                <div style={{marginTop: '2.5rem'}}>
                    <Link to="/" className="cta-button">Back to Homepage</Link>
                </div>
            </div>
        </main>
    );
};

export default OrderOnlinePage;