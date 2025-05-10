// src/pages/BookingPage.test.js
import { initializeTimes, updateTimes } from './BookingPage'; // Assuming these are exported
import { fetchAPI } from '../api/bookingAPI';

// Mock the fetchAPI module
jest.mock('../api/bookingAPI', () => ({
    ...jest.requireActual('../api/bookingAPI'), // Import and retain default behavior for other exports
    fetchAPI: jest.fn(), // Mock only fetchAPI
}));

// Mock console.error for tests where API failure is simulated
let consoleErrorSpy;

beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error output during tests
});

afterAll(() => {
    consoleErrorSpy.mockRestore(); // Restore original console.error
});


describe('BookingPage utility functions', () => {
    beforeEach(() => {
        // Clear all mock implementations and calls before each test
        fetchAPI.mockClear();
        consoleErrorSpy.mockClear(); // Clear console.error mock calls
    });

    describe('initializeTimes', () => {
        it('should return times provided by fetchAPI for a given date', async () => {
            const mockDate = '2025-10-20';
            const expectedTimes = ['17:00', '17:30', '18:00'];
            fetchAPI.mockResolvedValue(expectedTimes);

            const result = await initializeTimes(mockDate);

            expect(fetchAPI).toHaveBeenCalledTimes(1);
            expect(fetchAPI).toHaveBeenCalledWith(mockDate);
            expect(result).toEqual(expectedTimes);
        });

        it('should return an empty array and log error if fetchAPI fails', async () => {
            const mockDate = '2025-10-21';
            fetchAPI.mockRejectedValue(new Error('API Network Error'));

            const result = await initializeTimes(mockDate);

            expect(fetchAPI).toHaveBeenCalledWith(mockDate);
            expect(result).toEqual([]);
            expect(console.error).toHaveBeenCalledWith("Failed to fetch initial times:", expect.any(Error));
        });

        it('should return an empty array if fetchAPI returns no times (empty array)', async () => {
            const mockDate = '2025-10-22';
            fetchAPI.mockResolvedValue([]);

            const result = await initializeTimes(mockDate);
            expect(result).toEqual([]);
        });
    });

    describe('updateTimes reducer', () => {
        const sampleInitialState = ['09:00', '10:00'];

        it('should return the payload for UPDATE_TIMES action', () => {
            const newTimesPayload = ['15:00', '16:00', '16:30'];
            const action = { type: 'UPDATE_TIMES', payload: newTimesPayload };
            const updatedState = updateTimes(sampleInitialState, action);
            expect(updatedState).toEqual(newTimesPayload);
        });

        it('should return the payload for INITIALIZE_TIMES action', () => {
            const initialTimesPayload = ['18:00', '19:00'];
            const action = { type: 'INITIALIZE_TIMES', payload: initialTimesPayload };
            // For initialize, the current state might be an empty array or some default
            const updatedState = updateTimes([], action);
            expect(updatedState).toEqual(initialTimesPayload);
        });

        it('should return the current state for an unrecognized action type', () => {
            const action = { type: 'SOME_OTHER_ACTION', payload: ['irrelevant'] };
            const updatedState = updateTimes(sampleInitialState, action);
            expect(updatedState).toEqual(sampleInitialState);
        });

        it('should correctly handle an empty array payload for recognized actions', () => {
            const action = { type: 'UPDATE_TIMES', payload: [] };
            const updatedState = updateTimes(sampleInitialState, action);
            expect(updatedState).toEqual([]);
        });
    });
});
