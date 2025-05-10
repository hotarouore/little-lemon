import React, { useEffect } from 'react';
import { useReservations } from '../context/ReservationContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './ContentPage.css';

const MyReservationsPage = () => {
    const { getUserReservations } = useReservations();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const reservations = getUserReservations(); // Get reservations for the current user

    useEffect(() => {
        if (!currentUser) {
            // Redirect to login, passing the current path to return to after login
            navigate('/login', { state: { from: '/my-reservations' } });
        }
    }, [currentUser, navigate]);

    if (!currentUser) {
        return <p style={{textAlign: 'center', padding: '2rem'}}>Loading or redirecting to login...</p>;
    }

    return (
        <main className="content-page">
            <div className="container">
                <h1>My Bookings</h1>
                {currentUser && <p style={{textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem'}}>Welcome, {currentUser.name || currentUser.email.split('@')[0]}! Here are your reservations for this session.</p>}
                {reservations.length === 0 ? (
                    <div style={{textAlign: 'center'}}>
                        <p>You have no reservations booked in this session.</p>
                        <p>Let's find you a table!</p>
                        <Link to="/booking" className="cta-button" style={{display: 'inline-block', marginTop: '1rem', padding: '0.8rem 1.8rem'}}>Book a Table Now</Link>
                    </div>
                ) : (
                    <ul className="reservations-list"> {/* Ensure .reservations-list and .reservation-item styles are in ContentPage.css or here */}
                        {reservations.map((res) => (
                            <li key={res.id || `${res.date}-${res.time}`} className="reservation-item"> {/* Fallback key if ID is missing */}
                                <p><strong>Date:</strong> {res.date}</p>
                                <p><strong>Time:</strong> {res.time}</p>
                                <p><strong>Guests:</strong> {res.guests}</p>
                                <p><strong>Occasion:</strong> {res.occasion}</p>
                                {res.seating && res.seating !== "No Preference" && <p><strong>Seating:</strong> {res.seating}</p>}
                                {res.specialRequests && <p><strong>Special Requests:</strong> "{res.specialRequests}"</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
};

export default MyReservationsPage;
