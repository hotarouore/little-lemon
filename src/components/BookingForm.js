import React, { useState, useEffect, useCallback } from 'react';
import './BookingForm.css';

const BookingForm = ({ availableTimes, dispatchDateChange, submitForm, today, initialData }) => {
    const [formData, setFormData] = useState({
        date: initialData?.date || today,
        time: initialData?.time || '',
        guests: initialData?.guests || 1,
        occasion: initialData?.occasion || 'Birthday',
        seating: initialData?.seating || 'Indoor',
        specialRequests: initialData?.specialRequests || '',
    });

    const [errors, setErrors] = useState({});
    const [isTouched, setIsTouched] = useState({
        date: false,
        time: false,
        guests: false,
        occasion: false,
    });

    useEffect(() => {
        if (formData.date === today && availableTimes && availableTimes.length > 0 && !initialData?.time) {
            setFormData(prevData => ({ ...prevData, time: availableTimes[0] }));
        } else if (formData.date === today && (!availableTimes || availableTimes.length === 0) && !initialData?.time) {
            setFormData(prevData => ({ ...prevData, time: '' }));
        }
    }, [today, availableTimes, initialData?.time, formData.date]);

    useEffect(() => {
        if (availableTimes && availableTimes.length > 0) {
            if (!formData.time || !availableTimes.includes(formData.time)) {
                setFormData(prevData => ({ ...prevData, time: availableTimes[0] }));
            }
        } else {
            if (!initialData || formData.date !== initialData.date) {
                setFormData(prevData => ({ ...prevData, time: '' }));
            }
        }
    }, [availableTimes, initialData, formData.date, formData.time]);

    const validateField = useCallback((name, value) => {
        let errorMsg = '';
        switch (name) {
            case 'date':
                if (!value) errorMsg = 'Date is required.';
                else if (new Date(value) < new Date(new Date().setHours(0,0,0,0))) errorMsg = 'Date cannot be in the past.';
                break;
            case 'time':
                if (availableTimes && availableTimes.length === 0 && value === '' && formData.date >= today) {
                    errorMsg = 'No times available for this date.';
                } else if (!value && availableTimes && availableTimes.length > 0) {
                    errorMsg = 'Time is required.';
                }
                break;
            case 'guests':
                const numGuests = parseInt(value, 10);
                if (isNaN(numGuests) || numGuests < 1) errorMsg = 'At least 1 guest required.';
                else if (numGuests > 10) errorMsg = 'Maximum 10 guests allowed.';
                break;
            case 'occasion':
                if (!value) errorMsg = 'Occasion is required.';
                break;
            default:
                break;
        }
        return errorMsg;
    }, [availableTimes, formData.date, today]);

    useEffect(() => {
        let changed = false;
        const newCalculatedErrors = {};

        Object.keys(formData).forEach(fieldName => {
            if (isTouched[fieldName] !== undefined) {
                const currentFieldValue = formData[fieldName];
                const newError = validateField(fieldName, currentFieldValue);
                newCalculatedErrors[fieldName] = newError;
                if (errors[fieldName] !== newError) {
                    changed = true;
                }
            }
        });

        Object.keys(errors).forEach(fieldName => {
            if (errors[fieldName] && !newCalculatedErrors[fieldName]) {
                changed = true;
            }
        });

        if (changed) {
            setErrors(newCalculatedErrors);
        }
    }, [formData, isTouched, validateField, errors]);

    const runAllValidations = useCallback(() => {
        const newValidationErrors = {};
        let formIsValidOverall = true;
        Object.keys(formData).forEach(key => {
            if (key !== 'specialRequests' && key !== 'seating') {
                const error = validateField(key, formData[key]);
                if (error) {
                    newValidationErrors[key] = error;
                    formIsValidOverall = false;
                }
            }
        });
        setErrors(newValidationErrors);
        return formIsValidOverall;
    }, [formData, validateField]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        if (name === 'date') {
            dispatchDateChange(value);
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setIsTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsTouched({ date: true, time: true, guests: true, occasion: true });
        const isValid = runAllValidations();
        if (isValid) {
            submitForm(formData);
        }
    };

    const isFormSubmittable = () => {
        // Check if all required fields are filled
        if (!formData.date || !formData.time || !formData.guests || !formData.occasion) {
            return false;
        }

        // Check for validation errors
        for (const key in formData) {
            if (key !== 'specialRequests' && key !== 'seating') {
                const fieldError = validateField(key, formData[key]);
                if (fieldError) return false;
            }
        }

        // Special case for time when no times are available
        if (availableTimes.length === 0 && formData.date >= today) {
            return false;
        }

        return true;
    };

    return (
        <form 
            className="booking-form" 
            onSubmit={handleSubmit} 
            noValidate 
            aria-labelledby="form-title"
            aria-describedby="form-description"
        >
            <h2 id="form-title" className="form-title-main">Book a Table</h2>
            <p id="form-description" className="form-description">
                Please fill out the form below to make your reservation. Fields marked with an asterisk (*) are required.
            </p>

            <div className="form-group">
                <label htmlFor="date">
                    Choose date <span className="required" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                </label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    min={today}
                    aria-describedby={errors.date && isTouched.date ? "date-error" : undefined}
                    aria-invalid={!!(errors.date && isTouched.date)}
                    aria-required="true"
                />
                {errors.date && isTouched.date && (
                    <p id="date-error" className="error-message" role="alert">
                        {errors.date}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="time">
                    Choose time <span className="required" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                </label>
                <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-describedby={errors.time && isTouched.time ? "time-error" : undefined}
                    aria-invalid={!!(errors.time && isTouched.time)}
                    aria-required="true"
                    disabled={availableTimes.length === 0 && formData.date >= today}
                >
                    {availableTimes.length === 0 && formData.date >= today ? (
                        <option value="" disabled>No times available</option>
                    ) : (
                        availableTimes.map(timeSlot => (
                            <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
                        ))
                    )}
                    {availableTimes.length > 0 && !formData.time && (
                        <option value="" disabled>Select a time</option>
                    )}
                </select>
                {errors.time && isTouched.time && (
                    <p id="time-error" className="error-message" role="alert">
                        {errors.time}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="guests">
                    Number of guests <span className="required" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                </label>
                <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="1"
                    max="10"
                    required
                    placeholder="1-10 guests"
                    aria-describedby={errors.guests && isTouched.guests ? "guests-error" : undefined}
                    aria-invalid={!!(errors.guests && isTouched.guests)}
                    aria-required="true"
                />
                {errors.guests && isTouched.guests && (
                    <p id="guests-error" className="error-message" role="alert">
                        {errors.guests}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="occasion">
                    Occasion <span className="required" aria-hidden="true">*</span>
                    <span className="sr-only">(required)</span>
                </label>
                <select
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    aria-describedby={errors.occasion && isTouched.occasion ? "occasion-error" : undefined}
                    aria-invalid={!!(errors.occasion && isTouched.occasion)}
                    aria-required="true"
                >
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Business">Business Meal</option>
                    <option value="Celebration">Celebration (Other)</option>
                    <option value="Casual">Casual Dining</option>
                </select>
                {errors.occasion && isTouched.occasion && (
                    <p id="occasion-error" className="error-message" role="alert">
                        {errors.occasion}
                    </p>
                )}
            </div>

            <fieldset className="form-group">
                <legend>Seating preference</legend>
                <div className="radio-group-container" role="radiogroup" aria-label="Seating preference">
                    <div className="radio-option">
                        <input
                            type="radio"
                            id="indoor"
                            name="seating"
                            value="Indoor"
                            checked={formData.seating === "Indoor"}
                            onChange={handleChange}
                            aria-label="Indoor seating"
                        />
                        <label htmlFor="indoor">Indoor</label>
                    </div>
                    <div className="radio-option">
                        <input
                            type="radio"
                            id="outdoor"
                            name="seating"
                            value="Outdoor"
                            checked={formData.seating === "Outdoor"}
                            onChange={handleChange}
                            aria-label="Outdoor seating"
                        />
                        <label htmlFor="outdoor">Outdoor</label>
                    </div>
                    <div className="radio-option">
                        <input
                            type="radio"
                            id="no-preference"
                            name="seating"
                            value="No Preference"
                            checked={formData.seating === "No Preference"}
                            onChange={handleChange}
                            aria-label="No seating preference"
                        />
                        <label htmlFor="no-preference">No Preference</label>
                    </div>
                </div>
            </fieldset>

            <div className="form-group">
                <label htmlFor="specialRequests">Special Requests</label>
                <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="Any special requests or dietary requirements?"
                    aria-label="Special requests or dietary requirements"
                />
            </div>

            <button
                type="submit"
                className="submit-button"
                disabled={!isFormSubmittable()}
                aria-disabled={!isFormSubmittable()}
            >
                Confirm and reserve your table
            </button>
        </form>
    );
};

export default BookingForm;
