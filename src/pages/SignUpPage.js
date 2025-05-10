import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser } = useAuth(); // Get currentUser to redirect if already logged in

    useEffect(() => {
        if (currentUser) {
            navigate(location.state?.from || '/'); // Redirect if already logged in
        }
    }, [currentUser, navigate, location.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error/success on new input
        if (error) setError('');
        if (successMessage) setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        // Simulate successful signup API call
        try {
            // const response = await api.signup(formData); // Real API call
            console.log('Simulating Sign Up with data:', formData);
            setSuccessMessage('Sign up successful! Redirecting to login...');

            // Redirect to login after a short delay, passing on any state from original location
            setTimeout(() => {
                navigate('/login', { state: location.state });
            }, 2000);

        } catch (apiError) {
            setError('Sign up failed. Please try again. (Simulated error)');
            console.error("Signup API error (simulated):", apiError);
        }
    };

    return (
        <main className="auth-page-container">
            <div className="auth-form-wrapper">
                <div className="auth-logo-placeholder">Little Lemon</div>
                <h1 className="auth-title">Create Account</h1>
                {error && <p className="auth-error" role="alert">{error}</p>}
                {successMessage && <p className="auth-success" role="alert" style={{color: '#d4edda', backgroundColor: '#155724', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem'}}>{successMessage}</p>}
                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name <span aria-hidden="true">*</span></label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            aria-describedby={error ? "auth-error-desc" : undefined}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email <span aria-hidden="true">*</span></label>
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
                        <label htmlFor="password">Password <span aria-hidden="true">*</span></label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Min. 8 characters"
                            aria-describedby={error ? "auth-error-desc" : (formData.password && formData.password.length < 8 ? "password-length-error" : undefined)}
                        />
                        {formData.password && formData.password.length > 0 && formData.password.length < 8 && (
                            <p id="password-length-error" className="auth-inline-error" style={{color: '#f8d7da', fontSize: '0.8em', marginTop: '0.25rem'}}>Password too short.</p>
                        )}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password <span aria-hidden="true">*</span></label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Re-enter your password"
                            aria-describedby={error ? "auth-error-desc" : (formData.confirmPassword && formData.password !== formData.confirmPassword ? "password-match-error" : undefined)}
                        />
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p id="password-match-error" className="auth-inline-error" style={{color: '#f8d7da', fontSize: '0.8em', marginTop: '0.25rem'}}>Passwords do not match.</p>
                        )}
                    </div>
                    <button type="submit" className="auth-button primary">
                        Sign Up
                    </button>
                    {error && <span id="auth-error-desc" className="visually-hidden">Authentication error: {error}</span>}
                </form>
                <div className="auth-switch-link">
                    <p>
                        Already have an account? <Link to="/login" state={location.state}>Sign In</Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default SignUpPage;
