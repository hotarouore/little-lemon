import React from 'react';
import {render, screen, fireEvent, waitFor, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import BookingForm from './BookingForm';
import userEvent from '@testing-library/user-event';

const getTodayDateString = () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}-${day}`;
};

describe('BookingForm Component', () => {
    const mockDispatchDateChange = jest.fn();
    const mockSubmitForm = jest.fn();
    const today = getTodayDateString();
    const defaultAvailableTimes = ['17:00', '18:00', '19:00', '20:00'];

    const getSubmitButton = () => screen.getByRole('button', { name: /Confirm and reserve your table/i });

    const renderBookingForm = (props) => {
        const defaultProps = {
            availableTimes: defaultAvailableTimes,
            dispatchDateChange: mockDispatchDateChange,
            submitForm: mockSubmitForm,
            today: today,
        };
        return render(<BookingForm {...defaultProps} {...props} />);
    };

    beforeEach(() => {
        mockDispatchDateChange.mockClear();
        mockSubmitForm.mockClear();
    });

    test('renders all form fields and the submit button correctly', () => {
        renderBookingForm();
        expect(screen.getByLabelText(/Choose date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Choose time/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Number of guests/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Occasion/i)).toBeInTheDocument();
        expect(screen.getByText('Seating preference')).toBeInTheDocument();
        expect(screen.getByLabelText('Indoor')).toBeInTheDocument();
        expect(screen.getByLabelText('Outdoor')).toBeInTheDocument();
        expect(screen.getByLabelText('No Preference')).toBeInTheDocument();
        expect(screen.getByLabelText(/Special requests/i)).toBeInTheDocument();

        const submitButton = getSubmitButton();
        expect(submitButton).toBeInTheDocument();
        expect(submitButton).toHaveTextContent('Confirm and reserve your table');
    });

    test('date input has today as min attribute and its default value', () => {
        renderBookingForm();
        const dateInput = screen.getByLabelText(/Choose date/i);
        expect(dateInput).toHaveAttribute('min', today);
        expect(dateInput).toHaveValue(today);
    });

    test('time select populates with availableTimes and selects the first by default', () => {
        renderBookingForm();
        const timeSelect = screen.getByLabelText(/Choose time/i);

        expect(timeSelect.options.length).toBe(defaultAvailableTimes.length);
        defaultAvailableTimes.forEach(time => {
            expect(within(timeSelect).getByRole('option', { name: time })).toBeInTheDocument();
        });

        expect(timeSelect).toHaveValue(defaultAvailableTimes[0]);
    });

    test('time select shows "No times available" and is disabled if availableTimes is empty for a valid date', () => {
        renderBookingForm({ availableTimes: [] });
        const timeSelect = screen.getByLabelText(/Choose time/i);
        expect(timeSelect).toBeDisabled();
        expect(within(timeSelect).getByRole('option', { name: /No times available/i })).toBeInTheDocument();
        expect(within(timeSelect).getByRole('option', { name: /No times available/i })).toBeDisabled();
    });

    test('number of guests input has correct min/max attributes and default value', () => {
        renderBookingForm();
        const guestsInput = screen.getByLabelText(/Number of guests/i);
        expect(guestsInput).toHaveAttribute('min', '1');
        expect(guestsInput).toHaveAttribute('max', '10');
        expect(guestsInput).toHaveValue(1);
    });

    test('occasion select has "Birthday" as default value', () => {
        renderBookingForm();
        expect(screen.getByLabelText(/Occasion/i)).toHaveValue('Birthday');
    });

    test('submit button is enabled when form is initially rendered with valid defaults', async () => {
        renderBookingForm();
        await waitFor(() => {
            expect(getSubmitButton()).toBeEnabled();
        });
    });

    test('form submission calls submitForm prop with correct data if all fields valid', async () => {
        renderBookingForm();
        const dateInput = screen.getByLabelText(/Choose date/i);
        const timeSelect = screen.getByLabelText(/Choose time/i);
        const guestsInput = screen.getByLabelText(/Number of guests/i);
        const occasionSelect = screen.getByLabelText(/Occasion/i);
        const outdoorRadio = screen.getByLabelText('Outdoor');
        const specialRequestsTextarea = screen.getByLabelText(/Special requests/i);
        const submitButton = getSubmitButton();

        fireEvent.change(dateInput, { target: { value: today } });
        fireEvent.change(timeSelect, { target: { value: defaultAvailableTimes[2] } });
        fireEvent.change(guestsInput, { target: { value: '3' } });
        fireEvent.change(occasionSelect, { target: { value: 'Anniversary' } });
        fireEvent.click(outdoorRadio);
        fireEvent.change(specialRequestsTextarea, { target: { value: 'Quiet table, please.' } });

        await waitFor(() => expect(submitButton).toBeEnabled());
        fireEvent.click(submitButton);

        expect(mockSubmitForm).toHaveBeenCalledTimes(1);
        expect(mockSubmitForm).toHaveBeenCalledWith({
            date: today,
            time: defaultAvailableTimes[2],
            guests: '3',
            occasion: 'Anniversary',
            seating: 'Outdoor',
            specialRequests: 'Quiet table, please.',
        });
    });

    test('date validation: shows error for past date and disables submit', async () => {
        renderBookingForm();
        const dateInput = screen.getByLabelText(/Choose date/i);
        const submitButton = getSubmitButton();
        const pastDate = '2020-01-15';

        fireEvent.change(dateInput, { target: { value: pastDate } });
        fireEvent.blur(dateInput);

        await waitFor(() => {
            expect(screen.getByText(/Date cannot be in the past/i)).toBeInTheDocument();
            expect(submitButton).toBeDisabled();
        });
    });

    test('guests validation: handles out-of-range values, shows errors, toggles submit button', async () => {
        renderBookingForm();
        const guestsInput = screen.getByLabelText(/Number of guests/i);
        const submitButton = getSubmitButton();

        fireEvent.change(guestsInput, { target: { value: '0' } });
        fireEvent.blur(guestsInput);
        await waitFor(() => {
            expect(screen.getByText(/At least 1 guest required/i)).toBeInTheDocument();
            expect(submitButton).toBeDisabled();
        });

        fireEvent.change(guestsInput, { target: { value: '12' } });
        fireEvent.blur(guestsInput);
        await waitFor(() => {
            expect(screen.getByText(/Maximum 10 guests allowed/i)).toBeInTheDocument();
            expect(submitButton).toBeDisabled();
        });

        fireEvent.change(guestsInput, { target: { value: '2' } });
        fireEvent.blur(guestsInput);
        await waitFor(() => {
            expect(screen.queryByText(/At least 1 guest required/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Maximum 10 guests allowed/i)).not.toBeInTheDocument();
            expect(submitButton).toBeEnabled();
        });
    });

    test('changing date input calls dispatchDateChange prop with the new date', () => {
        renderBookingForm();
        const dateInput = screen.getByLabelText(/Choose date/i);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];

        fireEvent.change(dateInput, { target: { value: tomorrowString } });

        expect(mockDispatchDateChange).toHaveBeenCalledTimes(1);
        expect(mockDispatchDateChange).toHaveBeenCalledWith(tomorrowString);
    });

    test('submit button is disabled and error message appears if selected date has no available times AFTER field was touched', async () => {
        const initialProps = {
            availableTimes: ['17:00', '18:00'],
            dispatchDateChange: mockDispatchDateChange,
            submitForm: mockSubmitForm,
            today: today,
        };
        const { rerender } = render(<BookingForm {...initialProps} />);
        const timeSelect = screen.getByLabelText(/Choose time/i);
        const submitButton = getSubmitButton();

        fireEvent.focus(timeSelect);
        fireEvent.change(timeSelect, { target: { value: '17:00' } });
        fireEvent.blur(timeSelect);

        rerender(<BookingForm {...initialProps} availableTimes={[]} />);

        await waitFor(() => {
            expect(screen.getByText(/No times available for this date/i)).toBeInTheDocument();
            expect(submitButton).toBeDisabled();
        });

        expect(within(timeSelect).getByRole('option', { name: /No times available/i })).toBeInTheDocument();
        expect(timeSelect).toBeDisabled();
    });

    test('renders all form fields with proper labels and ARIA attributes', () => {
        renderBookingForm();

        // Check form title and description
        expect(screen.getByText('Book a Table')).toBeInTheDocument();
        expect(screen.getByText(/Please fill out the form below/)).toBeInTheDocument();

        // Check required field indicators
        const requiredFields = screen.getAllByText('*');
        expect(requiredFields).toHaveLength(4); // date, time, guests, occasion

        // Check form fields and their ARIA attributes
        const dateInput = screen.getByLabelText(/Choose date/);
        expect(dateInput).toHaveAttribute('aria-required', 'true');
        expect(dateInput).toHaveAttribute('type', 'date');

        const timeSelect = screen.getByLabelText(/Choose time/);
        expect(timeSelect).toHaveAttribute('aria-required', 'true');

        const guestsInput = screen.getByLabelText(/Number of guests/);
        expect(guestsInput).toHaveAttribute('aria-required', 'true');
        expect(guestsInput).toHaveAttribute('type', 'number');

        const occasionSelect = screen.getByLabelText(/Occasion/);
        expect(occasionSelect).toHaveAttribute('aria-required', 'true');

        // Check radio group accessibility
        const radioGroup = screen.getByRole('radiogroup');
        expect(radioGroup).toHaveAttribute('aria-label', 'Seating preference');
    });

    test('validates required fields on blur', async () => {
        renderBookingForm();

        // Test date validation
        const dateInput = screen.getByLabelText(/Choose date/);
        fireEvent.change(dateInput, { target: { value: '' } });
        fireEvent.blur(dateInput);
        await waitFor(() => {
            expect(screen.getByText('Date is required.')).toBeInTheDocument();
        });

        // Test guests validation
        const guestsInput = screen.getByLabelText(/Number of guests/);
        fireEvent.change(guestsInput, { target: { value: '0' } });
        fireEvent.blur(guestsInput);
        await waitFor(() => {
            expect(screen.getByText('At least 1 guest required.')).toBeInTheDocument();
        });

        // Test occasion validation
        const occasionSelect = screen.getByLabelText(/Occasion/);
        fireEvent.change(occasionSelect, { target: { value: '' } });
        fireEvent.blur(occasionSelect);
        await waitFor(() => {
            expect(screen.getByText('Occasion is required.')).toBeInTheDocument();
        });
    });

    test('validates date cannot be in the past', async () => {
        renderBookingForm();
        const dateInput = screen.getByLabelText(/Choose date/);
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        fireEvent.change(dateInput, { target: { value: yesterdayStr } });
        fireEvent.blur(dateInput);
        
        await waitFor(() => {
            expect(screen.getByText('Date cannot be in the past.')).toBeInTheDocument();
        });
    });

    test('validates guests number range', async () => {
        renderBookingForm();
        const guestsInput = screen.getByLabelText(/Number of guests/);
        
        // Test minimum value
        fireEvent.change(guestsInput, { target: { value: '0' } });
        fireEvent.blur(guestsInput);
        await waitFor(() => {
            expect(screen.getByText('At least 1 guest required.')).toBeInTheDocument();
        });

        // Test maximum value
        fireEvent.change(guestsInput, { target: { value: '11' } });
        fireEvent.blur(guestsInput);
        await waitFor(() => {
            expect(screen.getByText('Maximum 10 guests allowed.')).toBeInTheDocument();
        });
    });

    test('handles form submission with valid data', async () => {
        renderBookingForm();
        
        // Fill in valid form data
        const dateInput = screen.getByLabelText(/Choose date/);
        const timeSelect = screen.getByLabelText(/Choose time/);
        const guestsInput = screen.getByLabelText(/Number of guests/);
        const occasionSelect = screen.getByLabelText(/Occasion/);
        const indoorRadio = screen.getByLabelText(/Indoor seating/);
        const specialRequests = screen.getByLabelText(/Special requests/);

        fireEvent.change(dateInput, { target: { value: today } });
        fireEvent.change(timeSelect, { target: { value: '17:00' } });
        fireEvent.change(guestsInput, { target: { value: '4' } });
        fireEvent.change(occasionSelect, { target: { value: 'Birthday' } });
        fireEvent.click(indoorRadio);
        fireEvent.change(specialRequests, { target: { value: 'Window seat preferred' } });

        // Submit form
        const submitButton = screen.getByRole('button', { name: /Confirm and reserve your table/ });
        fireEvent.click(submitButton);

        // Verify form submission
        expect(mockSubmitForm).toHaveBeenCalledWith({
            date: today,
            time: '17:00',
            guests: '4',
            occasion: 'Birthday',
            seating: 'Indoor',
            specialRequests: 'Window seat preferred'
        });
    });

    test('disables submit button when form is invalid', async () => {
        renderBookingForm();
        
        const submitButton = screen.getByRole('button', { name: /Confirm and reserve your table/ });
        expect(submitButton).not.toBeDisabled(); // Button should be enabled initially due to valid defaults

        // Make form invalid by clearing required fields
        const dateInput = screen.getByLabelText(/Choose date/);
        const timeSelect = screen.getByLabelText(/Choose time/);
        const guestsInput = screen.getByLabelText(/Number of guests/);
        const occasionSelect = screen.getByLabelText(/Occasion/);

        fireEvent.change(dateInput, { target: { value: '' } });
        fireEvent.blur(dateInput);
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });

        // Restore valid values
        fireEvent.change(dateInput, { target: { value: today } });
        fireEvent.change(timeSelect, { target: { value: '17:00' } });
        fireEvent.change(guestsInput, { target: { value: '4' } });
        fireEvent.change(occasionSelect, { target: { value: 'Birthday' } });

        // Button should be enabled again
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });

    test('handles no available times gracefully', () => {
        renderBookingForm({ availableTimes: [] });
        
        const timeSelect = screen.getByLabelText(/Choose time/);
        expect(timeSelect).toBeDisabled();
        expect(screen.getByText('No times available')).toBeInTheDocument();
    });

    test('maintains form state when switching between dates', async () => {
        renderBookingForm();
        
        const dateInput = screen.getByLabelText(/Choose date/);
        const timeSelect = screen.getByLabelText(/Choose time/);
        const guestsInput = screen.getByLabelText(/Number of guests/);
        
        // Fill in some data
        fireEvent.change(dateInput, { target: { value: today } });
        fireEvent.change(timeSelect, { target: { value: '17:00' } });
        fireEvent.change(guestsInput, { target: { value: '4' } });
        
        // Change date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        
        fireEvent.change(dateInput, { target: { value: tomorrowStr } });
        
        // Verify dispatchDateChange was called
        expect(mockDispatchDateChange).toHaveBeenCalledWith(tomorrowStr);
        
        // Verify form state is maintained
        expect(timeSelect).toHaveValue('17:00');
        expect(guestsInput).toHaveValue(4);
    });
});
