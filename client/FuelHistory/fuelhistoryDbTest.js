// Test suite for database operations related to the history page

describe('History Page Database Operations', () => {
    const db = dbService.getDbServiceInstance();

    // After all tests, close the database connection
    afterAll(async () => {
        await db.closeConnection();
    });

    // Test for fetching fuel quote history
    describe('fetchFuelQuoteHistory', () => {
        test('should return an array of fuel quote history for a valid clientID', async () => {
            // Mock a valid clientID
            const clientID = 'validClientID';

            // Mock successful database query
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate successful query
                    const fakeFuelQuoteHistory = [{ quoteID: 1, gallonsRequested: 100, deliveryAddress: '123 Main St', deliveryDate: '2024-02-28', suggestedPrice: 2.5, totalPrice: 250 }];
                    callback(null, fakeFuelQuoteHistory);
                })
            });

            // Call the function and expect it to resolve with fuel quote history data
            const fuelQuoteHistory = await db.fetchFuelQuoteHistory(clientID);
            expect(fuelQuoteHistory).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    quoteID: expect.any(Number),
                    gallonsRequested: expect.any(Number),
                    deliveryAddress: expect.any(String),
                    deliveryDate: expect.any(String),
                    suggestedPrice: expect.any(Number),
                    totalPrice: expect.any(Number)
                })
            ]));
        });

        test('should return an empty array if no fuel quote history found for the clientID', async () => {
            // Mock a clientID with no history
            const clientID = 'noHistoryClientID';

            // Mock database query returning no results
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate empty result set
                    callback(null, []);
                })
            });

            // Call the function and expect it to resolve with an empty array
            const fuelQuoteHistory = await db.fetchFuelQuoteHistory(clientID);
            expect(fuelQuoteHistory).toEqual([]);
        });

        test('should throw an error if database query fails', async () => {
            // Mock a valid clientID
            const clientID = 'validClientID';

            // Mock database query throwing an error
            const mockError = new Error('Database query failed');
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError); // Simulate an error
                })
            });

            // Call the function and expect it to reject with an error
            await expect(db.fetchFuelQuoteHistory(clientID)).rejects.toThrow(mockError.message);
        });
    });

    // Additional tests for other database operations related to the history page can be added here
});
