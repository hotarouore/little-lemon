import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login, currentUser } = useAuth();

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate(location.state?.from || '/'); // Redirect to previous page or home
        }
    }, [currentUser, navigate, location.state]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Simulate backend API call for login
        try {
            // In a real app, this would be an API call:
            // const response = await api.login(formData.email, formData.password);
            if (formData.password.length >= 6) {
                console.log('Login attempt:', formData);
                // Simulate fetching user details
                const userName = formData.email.split('@')[0].replace(/\W/g, ''); // Basic name from email
                login({ email: formData.email, name: userName });
                alert('Login successful!');

                // If redirected from booking with form data, navigate back and pass it
                if (location.state?.from && location.state?.bookingAttemptData) {
                    navigate(location.state.from, { state: { bookingAttemptData: location.state.bookingAttemptData, justLoggedIn: true } });
                } else {
                    navigate(location.state?.from || '/'); // Navigate to previous page or home
                }

            } else {
                setError('Invalid email or password. (Hint: try email containing "test" and password >= 6 chars)');
            }
        } catch (apiError) {
            setError('Login failed. Please try again later.');
            console.error("Login API error (simulated):", apiError);
        }
    };

    return (
        <main className="auth-page-container">
            <div className="auth-form-wrapper">
                <div className="auth-logo-placeholder">Little Lemon</div>
                <h1 className="auth-title">Sign In</h1>
                {error && <p className="auth-error" role="alert">{error}</p>}
                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="e.g., user@example.com"
                            aria-describedby={error ? "auth-error-desc" : undefined}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            aria-describedby={error ? "auth-error-desc" : undefined}
                        />
                    </div>
                    <Link to="/forgot-password" className="auth-forgot-password"> {/* Placeholder for forgot password functionality */}
                        Forgot your password?
                    </Link>
                    <button type="submit" className="auth-button primary">
                        Sign In
                    </button>
                    {error && <span id="auth-error-desc" className="visually-hidden">Authentication error: {error}</span>}
                </form>
                <div className="auth-switch-link">
                    <p>
                        Don't have an account? <Link to="/signup" state={location.state}>Sign up</Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
