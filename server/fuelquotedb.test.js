const dbService = require("./db");

describe('dbService', () => {
    const db = dbService.getDbServiceInstance();
    afterAll(async () => {
        await db.closeConnection();
    });

    describe('submitFuelQuote', () => {
        test('should insert data into the fuelquote table and return true upon successful insertion', async () => {
            // Mock data
            const galreq = 10;
            const deliveryaddress = '123 Test St';
            const deliverydate = '2024-07-30';
            const suggestedprice = 2.57;
            const totaldue = 25.70;
            const clientID = '12345';
    
            // Mock the getConnection function to return a mock connection object
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate successful insertion
                    callback(null, { insertId: 1 }); // Mocking the result object with insertId
                })
            });
    
            // Call the function being tested
            const success = await db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID);
    
            // Expectations
            expect(success).toBe(true);
    
            // Check if the query was called with the correct parameters
            expect(db.getConnection().query).toHaveBeenCalledWith(
                "INSERT INTO fuelquote (clientID, galreq, deliveryaddress, deliverydate, totaldue, suggestedprice) VALUES (?,?,?,?,?,?)",
                [clientID, galreq, deliveryaddress, deliverydate, totaldue, suggestedprice],
                expect.any(Function) // Expecting a callback function
            );
        });    

        test('should throw an error if galreq is missing', async () => {
            const galreq = '';
            const deliveryaddress = '123 TEST';
            const deliverydate = '2024-07-30';
            const suggestedprice = 2.57;
            const totaldue = '';
            const clientID = '12345';

            await expect(db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID)).rejects.toThrow('All fields are required.');
        });

        test('should throw an error if deliveryaddress is missing', async () => {
            const galreq = 10;
            const deliveryaddress = '';
            const deliverydate = '2024-07-30';
            const suggestedprice = 2.57;
            const totaldue = 20.57;
            const clientID = '12345';

            await expect(db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID)).rejects.toThrow('All fields are required.');
        });

        test('should throw an error if deliverydate is missing', async () => {
            const galreq = 10;
            const deliveryaddress = '123 TEST';
            const deliverydate = '';
            const suggestedprice = 2.57;
            const totaldue = 20.57;
            const clientID = '12345';

            await expect(db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID)).rejects.toThrow('All fields are required.');
        });

        test('should throw an error if suggestedprice is missing', async () => {
            const galreq = 10;
            const deliveryaddress = '123 TEST';
            const deliverydate = '2024-07-30';
            const suggestedprice = '';
            const totaldue = '';
            const clientID = '12345';

            await expect(db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID)).rejects.toThrow('All fields are required.');
        });

        // test for database query error
        test('should reject with an error if an error occurs during database query', async () => {
            const galreq = 10;
            const deliveryaddress = '123 TEST';
            const deliverydate = '2024-07-30';
            const suggestedprice = 2.57;
            const totaldue = 20.57;
            const clientID = '';
            const mockError = new Error('All fields are required.');

            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError); // simulate an error
                })
            });

            await expect(db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID)).rejects.toThrow(mockError.message);
        });

        test('should reject with an error if an error occurs during database query', async () => {
            // Mock data
            const galreq = 10;
            const deliveryaddress = '123 TEST';
            const deliverydate = '07/30/2024';
            const suggestedprice = 2.57;
            const totaldue = 20.57;
            const clientID = '12345';
            const mockError = new Error('Form submission failed');
    
            // Mock the getConnection method to return a connection with a query method that throws an error
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError); // Simulate an error
                })
            });
    
            // Call the function and expect it to reject with the mock error message
            await expect(db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID)).rejects.toThrow(mockError.message);
        });
    });
});
