import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ReservationProvider } from './context/ReservationContext';
import { CartProvider } from './context/CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>
            <ReservationProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </ReservationProvider>
        </AuthProvider>
    </React.StrictMode>
);

reportWebVitals();
