import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Nav.css';

const Nav = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navRef = useRef();

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target) && !event.target.closest('.menu-icon-button')) {
                setIsMobileMenuOpen(false);
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);


    return (
        <>
            <button className="menu-icon-button" onClick={toggleMobileMenu} aria-label="Toggle navigation menu" aria-expanded={isMobileMenuOpen}>
                {isMobileMenuOpen ? '✕' : '☰'} {/* Simple text icons for open/close */}
            </button>
            <nav className={`main-nav ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Main navigation" ref={navRef}>
                <ul className="nav-links">
                    <li><NavLink to="/" onClick={closeMobileMenu} className={({isActive}) => isActive ? "active-link" : ""}>Home</NavLink></li>
                    <li><NavLink to="/about" onClick={closeMobileMenu} className={({isActive}) => isActive ? "active-link" : ""}>About</NavLink></li>
                    <li><NavLink to="/menu" onClick={closeMobileMenu} className={({isActive}) => isActive ? "active-link" : ""}>Menu</NavLink></li>
                    <li><NavLink to="/booking" onClick={closeMobileMenu} className={({isActive}) => isActive ? "active-link" : ""}>Reservations</NavLink></li>
                    <li><NavLink to="/order-online" onClick={closeMobileMenu} className={({isActive}) => isActive ? "active-link" : ""}>Order Online</NavLink></li>
                    {currentUser ? (
                        <>
                            <li><NavLink to="/my-reservations" onClick={closeMobileMenu} className={({isActive}) => isActive ? "active-link" : ""}>My Bookings</NavLink></li>
                            <li>
                                <button onClick={handleLogout} className="nav-button-link">
                                    Logout ({currentUser.name || currentUser.email.split('@')[0]})
                                </button>
                            </li>
                        </>
                    ) : (
                        <li><NavLink to="/login" onClick={closeMobileMenu} className="login-link" >Login</NavLink></li>
                    )}
                </ul>
            </nav>
        </>
    );
};

export default Nav;
