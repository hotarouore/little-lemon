/**
 * Simulates fetching available booking times for a given date.
 * @param {string} date - The date for which to fetch available times (YYYY-MM-DD).
 * @returns {Promise<string[]>} A promise that resolves to an array of available time slots.
 */
export const fetchAPI = (date) => {
    return new Promise((resolve) => {
        // Simple seeded random number generator for consistency based on date
        const seededRandom = (seed) => {
            let s = seed;
            const mask = 0xffffffff;
            s = (s & mask) + 0x60000000; // Ensure positive seed
            return () => {
                s = (s + 0x9e3779b9) & mask;
                s = Math.imul(s ^ (s >>> 16), 0x21f0aaad);
                s = Math.imul(s ^ (s >>> 15), 0x735a2d97);
                s = s ^ (s >>> 16);
                return (s >>> 0) / mask; // Return value between 0 and 1
            };
        };

        const result = [];
        const daySeed = new Date(date).getDate(); // Use day of the month as part of the seed
        const random = seededRandom(daySeed);

        // Generate times between 17:00 and 22:00
        for (let i = 17; i <= 22; i++) {
            if (random() > 0.3) result.push(`${i}:00`);
            if (random() > 0.6) result.push(`${i}:30`);
        }
        // Ensure some base availability if randomness removed too many
        if (result.length < 3 && new Date(date) >= new Date(new Date().setHours(0,0,0,0))) {
            const baseTimes = ["17:00", "18:00", "19:00", "20:00"];
            baseTimes.forEach(t => {
                if (!result.includes(t) && random() > 0.4) result.push(t);
            });
        }
        // Simulate API delay
        setTimeout(() => resolve([...new Set(result)].sort((a, b) => a - b)), 500 + Math.random() * 500);
    });
};

/**
 * Simulates submitting booking data to an API.
 * @param {object} formData - The data from the booking form.
 * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
 */
export const submitAPI = (formData) => {
    return new Promise((resolve) => {
        console.log("Submitting reservation data to dummy API:", formData);
        // Simulate a successful submission based on some criteria
        const success = formData && formData.date && formData.time && formData.guests && parseInt(formData.guests, 10) > 0;
        // Simulate API delay
        setTimeout(() => resolve(success), 500 + Math.random() * 500);
    });
};
