const dbService = require("./db");

describe('dbService', () => {
    const db = dbService.getDbServiceInstance();
    afterAll(async () => {
        await db.closeConnection();
    });

    describe('submitFuelQuote', () => {
        // test for successful submission
        test('should return true upon successful submission', async () => {
            // mock data with all required parameters
            const galreq = 10;
            const deliveryaddress = '123 Test Lane';
            const deliverydate = '03/30/2024';
            const suggestedprice = 2.57;
            const totaldue = 25.70;
            const clientID = '12345';

            // call func & expect it to return true
            const success = await db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID);
            expect(success).toBe(true);
        });

        test('should throw an error if galreq is missing', async () => {
            const galreq = '';
            const deliveryaddress = '123 Test Lane';
            const deliverydate = '03/30/2024';
            const suggestedprice = 2.57;
            const totaldue = '';
            const clientID = '12345';

            await expect(db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID)).rejects.toThrow('All fields are required.');
        });

        test('should throw an error if deliveryaddress is missing', async () => {
            const galreq = 10;
            const deliveryaddress = '';
            const deliverydate = '03/30/2024';
            const suggestedprice = 2.57;
            const totaldue = 20.57;
            const clientID = '12345';

            await expect(db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID)).rejects.toThrow('All fields are required.');
        });

        test('should throw an error if deliverydate is missing', async () => {
            const galreq = 10;
            const deliveryaddress = '123 Test Lane';
            const deliverydate = '';
            const suggestedprice = 2.57;
            const totaldue = 20.57;
            const clientID = '12345';

            await expect(db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID)).rejects.toThrow('All fields are required.');
        });

        test('should throw an error if suggestedprice is missing', async () => {
            const galreq = 10;
            const deliveryaddress = '123 Test Lane';
            const deliverydate = '03/30/2024';
            const suggestedprice = '';
            const totaldue = '';
            const clientID = '12345';

            await expect(db.submitFuelQuote(galreq, deliveryaddress, deliverydate, suggestedprice, totaldue, clientID)).rejects.toThrow('All fields are required.');
        });

        // test for database query error
        test('should reject with an error if an error occurs during database query', async () => {
            const galreq = 10;
            const deliveryaddress = '123 Test Lane';
            const deliverydate = '03/30/2024';
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
    });
});
