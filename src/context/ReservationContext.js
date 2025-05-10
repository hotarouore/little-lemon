// src/context/ReservationContext.js
import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

const ReservationContext = createContext(null);

export const ReservationProvider = ({ children }) => {
    const [allUserReservations, setAllUserReservations] = useState({});
    const { currentUser } = useAuth();

    const addReservation = (reservationData) => {
        if (!currentUser || !currentUser.email) {
            console.warn("No logged-in user to associate reservation with. Storing anonymously for session.");
            // For now, let's use a generic key for anonymous or just log.
            // Or, we can decide not to save if not logged in after BookingPage warning.
            // This behavior should be consistent with BookingPage logic.
            // If BookingPage proceeds, we should handle it.
            const anonymousUserKey = 'anonymous_user';
            setAllUserReservations(prevReservations => {
                const userReservations = prevReservations[anonymousUserKey] ? [...prevReservations[anonymousUserKey]] : [];
                userReservations.push({ ...reservationData, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) });
                return { ...prevReservations, [anonymousUserKey]: userReservations };
            });
            return;
        }

        const userEmail = currentUser.email;
        setAllUserReservations(prevReservations => {
            const userReservations = prevReservations[userEmail] ? [...prevReservations[userEmail]] : [];
            // Add a more robust unique ID
            userReservations.push({ ...reservationData, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) });
            // console.log(`Reservation added for ${userEmail}:`, userReservations);
            return { ...prevReservations, [userEmail]: userReservations };
        });
    };

    const getUserReservations = () => {
        if (currentUser && currentUser.email) {
            return allUserReservations[currentUser.email] || [];
        }
        // Optionally, return anonymous reservations if needed elsewhere
        // return allUserReservations['anonymous_user'] || [];
        return [];
    };

    return (
        <ReservationContext.Provider value={{ addReservation, getUserReservations }}>
            {children}
        </ReservationContext.Provider>
    );
};

export const useReservations = () => useContext(ReservationContext);
