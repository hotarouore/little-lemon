import React, {useReducer, useEffect, useState} from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { fetchAPI, submitAPI } from '../api/bookingAPI';
import { useReservations } from '../context/ReservationContext';
import { useAuth } from '../context/AuthContext';

// Helper to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
};

// Reducer function to manage available times
export const updateTimes = (state, action) => {
    switch (action.type) {
        case 'INITIALIZE_TIMES':
        case 'UPDATE_TIMES':
            return action.payload; // Payload should be the array of times
        default:
            return state; // Or throw new Error(`Unhandled action type: ${action.type}`);
    }
};

// Async initializer function for the reducer, to be called in useEffect
export const initializeTimes = async (date) => {
    try {
        const times = await fetchAPI(date);
        return times && times.length > 0 ? times : [];
    } catch (error) {
        console.error("Failed to fetch initial times:", error);
        return []; // Return empty array on error
    }
};


const BookingPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // To get state passed during navigation
    const today = getTodayDate();

    const [availableTimes, dispatchTimes] = useReducer(updateTimes, []);
    const { addReservation } = useReservations();
    const { currentUser } = useAuth();

    // State for pre-filling form if redirected from login
    const [initialFormData, setInitialFormData] = useState(null);

    useEffect(() => {
        // Check if there's bookingAttemptData passed from login redirection
        if (location.state && location.state.bookingAttemptData) {
            setInitialFormData(location.state.bookingAttemptData);
            // Clean the state from location to prevent re-processing
            window.history.replaceState({}, document.title)
        }
    }, [location.state]);


    useEffect(() => {
        // Determine the date to initialize with: either from redirected data or today
        const dateToInitialize = initialFormData?.date || today;
        initializeTimes(dateToInitialize).then(times => {
            dispatchTimes({ type: 'INITIALIZE_TIMES', payload: times });
        });
    }, [today, initialFormData]);


    const handleDateChange = async (selectedDate) => {
        try {
            const times = await fetchAPI(selectedDate);
            dispatchTimes({ type: 'UPDATE_TIMES', payload: times || [] });
        } catch (error) {
            console.error("Failed to fetch times for selected date:", error);
            dispatchTimes({ type: 'UPDATE_TIMES', payload: [] });
        }
    };

    const submitForm = async (formData) => {
        if (!currentUser) {
            alert("Please log in to make and save your reservation.");
            // Pass current form data to login page so it can be repopulated after login
            navigate('/login', { state: { from: location.pathname, bookingAttemptData: formData } });
            return;
        }

        const success = await submitAPI(formData);
        if (success) {
            addReservation(formData);
            try {
                // Use localStorage for immediate confirmation page display
                localStorage.setItem('bookingData', JSON.stringify(formData));
                navigate('/confirmed');
            } catch (e) {
                console.error("Could not save to localStorage", e);
                // Still navigate, but confirmation page might not have all details
                navigate('/confirmed');
            }
        } else {
            alert('Booking submission failed. Please try again or contact us.');
        }
    };

    return (
        <main className="booking-page-container container" aria-labelledby="booking-page-title">
            <h1 id="booking-page-title" className="visually-hidden">Book a Table at Little Lemon</h1>
            {!currentUser && (
                <div className="login-prompt-banner">
                    <p>
                        You are not logged in. Please <Link to="/login" state={{ from: location.pathname, bookingAttemptData: initialFormData }}>Login</Link> or <Link to="/signup">Sign Up</Link> to save your reservations with your account.
                    </p>
                    <p className="prompt-detail">(You can proceed to book, and we'll hold the details for this session.)</p>
                </div>
            )}
            <BookingForm
                availableTimes={availableTimes}
                dispatchDateChange={handleDateChange}
                submitForm={submitForm}
                today={today}
            />
        </main>
    );
};

export default BookingPage;
