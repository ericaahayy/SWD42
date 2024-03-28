const dbService = require("./db");

describe('dbService', () => {
    const db = dbService.getDbServiceInstance();
    afterAll(async () => {
        await db.closeConnection();
    });

    describe('getFuelHistory', () => {
        test('should throw an error if clientID is missing', async () => {
            // Mock data with missing clientID
            const clientID = '';
        
            // Call the function and expect it to throw an error
            await expect(db.getFuelHistory(clientID)).rejects.toThrow('clientID is required.');
        });

        test('should return fuel history data for a valid clientID', async () => {
            // Mock data
            const clientID = '0';
            const mockFuelHistory = [
                { quoteID: 1, galreq: 100.00, suggestedprice: 2.50, totaldue: 250.00, deliveryaddress: '123 Address Ln', deliverydate: '2024-03-24' },
            ];

            // Mock successful database query
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate successful data retrieval
                    callback(null, mockFuelHistory);
                })
            });

            // Call the function and expect it to resolve with fuel history data
            await expect(db.getFuelHistory(clientID)).resolves.toEqual(mockFuelHistory);
        });

        test('should reject with an error if database query fails', async () => {
            // Mock data
            const clientID = '-1';
            const mockError = new Error('Error executing database query:');

            // Mock error during database query
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate an error
                    callback(mockError);
                })
            });

            // Call the function and expect it to reject with an error
            await expect(db.getFuelHistory(clientID)).rejects.toThrow(mockError.message);
        });
    });
    
    describe('quoteFilter', () => {
        test('should throw an error if clientID is missing', async () => {
            // Mock data with missing clientID
            const clientID = '';
            const quoteID = 1;
        
            // Call the function and expect it to throw an error
            await expect(db.quoteFilter(clientID, quoteID)).rejects.toThrow('clientID and quoteID are required.');
        });
        
        test('should return the filtered quote based on clientID and quoteID', async () => {
            const clientID = '0';
            const quoteID = 1;
        
            const mockData = [
                { quoteID: 1, galreq: 100.00, suggestedprice: 2.50, totaldue: 250.00, deliveryaddress: '123 Address Ln', deliverydate: '2024-03-24' },
                { quoteID: 2, galreq: 50.00, suggestedprice: 2.50, totaldue: 125.00, deliveryaddress: '123 Address Dr', deliverydate: '2024-03-22' },
                { quoteID: 3, galreq: 100.00, suggestedprice: 2.50, totaldue: 250.00, deliveryaddress: '333 New Dr', deliverydate: '2024-02-15' }
            ];
        
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    const filteredResults = mockData.filter(entry => entry.clientID === clientID && entry.quoteID === quoteID);
                    callback(null, filteredResults);
                })
            });
        
            const response = await db.quoteFilter(clientID, quoteID);
            expect(response).toBeDefined();
        });

        test('should throw an error if the database query fails', async () => {
            const clientID = '-1';
            const quoteID = 1;
            const mockError = new Error('Error executing database query:');

            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError, null);
                })
            });

            await expect(db.quoteFilter(clientID, quoteID)).rejects.toThrow(mockError.message);
        });
    });
    
    describe('filterByDate', () => {
        test('should throw an error if clientID is missing', async () => {
            // Mock data with missing clientID
            const clientID = '';
            const startDate = '2024-03-20';
            const endDate = '2024-03-25';
    
            // Call the function and expect it to throw an error
            await expect(db.filterByDate(clientID, startDate, endDate)).rejects.toThrow('clientID, start date, and end date are required.');
        });
        
        test('should throw an error if start date is missing', async () => {
            // Mock data with missing start date
            const clientID = '12345';
            const startDate = '';
            const endDate = '2024-03-25';
    
            // Call the function and expect it to throw an error
            await expect(db.filterByDate(clientID, startDate, endDate)).rejects.toThrow('clientID, start date, and end date are required.');
        });
    
        test('should throw an error if end date is missing', async () => {
            // Mock data with missing end date
            const clientID = '12345';
            const startDate = '2024-03-20';
            const endDate = '';
    
            // Call the function and expect it to throw an error
            await expect(db.filterByDate(clientID, startDate, endDate)).rejects.toThrow('clientID, start date, and end date are required.');
        });
    
        test('should return filtered quotes based on the provided start and end dates', async () => {
            // Mock data
            const clientID = '0';
            const startDate = '2024-03-20';
            const endDate = '2024-03-25';
            const mockData = [
                { quoteID: 1, galreq: 100.00, suggestedprice: 2.50, totaldue: 250.00, deliveryaddress: '123 Address Ln', deliverydate: '2024-03-24' },
                { quoteID: 2, galreq: 50.00, suggestedprice: 2.50, totaldue: 125.00, deliveryaddress: '123 Address Dr', deliverydate: '2024-03-22' },
                { quoteID: 3, galreq: 100.00, suggestedprice: 2.50, totaldue: 250.00, deliveryaddress: '333 New Dr', deliverydate: '2024-02-15' }
            ];
    
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    const filteredResults = mockData.filter(entry => entry.clientID === clientID && entry.deliverydate >= startDate && entry.deliverydate <= endDate);
                    callback(null, filteredResults);
                })
            });
    
            const filteredQuotes = await db.filterByDate(clientID, startDate, endDate);
            expect(filteredQuotes).toBeDefined();
        });

        test('should reject with an error if an error occurs during database query', async () => {
            // Mock data
            const clientID = '-1';
            const startDate = '2024-03-20';
            const endDate = '2024-03-25';
            const mockError = new Error('Error executing database query:');
    
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError); // Simulate an error
                })
            });
    
            await expect(db.filterByDate(clientID, startDate, endDate)).rejects.toThrow(mockError.message);
        });
    });
    
});
