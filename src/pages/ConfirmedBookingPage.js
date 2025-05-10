import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ConfirmedBookingPage.css';
import { useAuth } from '../context/AuthContext';

const ConfirmedBookingPage = () => {
    const [bookingData, setBookingData] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        try {
            const dataString = localStorage.getItem('bookingData');
            if (dataString) {
                setBookingData(JSON.parse(dataString));
            }
        } catch (e) {
            console.error("Could not retrieve or parse booking data from localStorage", e);
        }
    }, []);

    return (
        <main className="confirmation-page-container" aria-labelledby="confirmation-main-title">
            <div className="confirmation-card">
                <div className="confirmation-icon" aria-hidden="true">🎉</div>
                <h1 id="confirmation-main-title">Booking Confirmed!</h1>

                {currentUser && <p className="greeting-message">Thank you, {currentUser.name || currentUser.email.split('@')[0]}, for your reservation at Little Lemon!</p>}
                {!currentUser && <p className="greeting-message">Thank you for your reservation at Little Lemon!</p>}

                {bookingData ? (
                    <section className="booking-details-summary" aria-labelledby="booking-details-heading">
                        <h2 id="booking-details-heading" className="visually-hidden">Your Reservation Details</h2>
                        <p><strong>Date:</strong> {bookingData.date}</p>
                        <p><strong>Time:</strong> {bookingData.time}</p>
                        <p><strong>Guests:</strong> {bookingData.guests}</p>
                        <p><strong>Occasion:</strong> {bookingData.occasion}</p>
                        {bookingData.seating && bookingData.seating !== "No Preference" && <p><strong>Seating:</strong> {bookingData.seating}</p>}
                        {bookingData.specialRequests && <p><strong>Special Requests:</strong> "{bookingData.specialRequests}"</p>}
                    </section>
                ) : (
                    <p className="fallback-message">We've received your booking request. A confirmation email (simulation) will be sent shortly with the details.</p>
                )}

                <p className="look-forward-message">
                    We look forward to welcoming you! A (simulated) confirmation email has been sent to {bookingData?.email || (currentUser ? currentUser.email : 'your email address')}.
                </p>
                <div className="confirmation-actions">
                    <Link to="/" className="cta-button home-button">Back to Homepage</Link>
                    {currentUser && <Link to="/my-reservations" className="cta-button view-my-bookings-button">View My Bookings</Link>}
                </div>
            </div>
        </main>
    );
};

export default ConfirmedBookingPage;
