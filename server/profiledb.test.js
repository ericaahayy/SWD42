const dbService = require("./db");

describe('dbService', () => {
    const db = dbService.getDbServiceInstance();
    afterAll(async () => {
        await db.closeConnection();
    });
    
    describe('getProfileData', () => {
        test('should return profile data for a valid clientID', async () => {
            const clientID = 15; // Example clientID
            const db = dbService.getDbServiceInstance();
            const profileData = await db.getProfileData(clientID);
            expect(profileData).toBeDefined(); // Check if data is defined
            // Add more specific assertions based on the expected data structure
        });
    
        test('should return null for an invalid clientID', async () => {
            const invalidClientID = -1; // Example invalid clientID
            const db = dbService.getDbServiceInstance();
            const profileData = await db.getProfileData(invalidClientID);
            expect(profileData).toBeNull(); // Check if data is null
        });

        test('should reject promise and log error when database query fails', async () => {            
            // Mocking the connection.query method to simulate a database query error
            clientID = -1;
            const mockError = new Error('Error fetching profile data from database:');
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError, null); // Simulate an error with null result
                })
            });
    
            // Asserting that the promise is rejected and error is logged
            await expect(db.getProfileData(clientID)).rejects.toThrow(mockError.message);
        });
    });    

    describe('updateProfile', () => {
        test('should throw an error if clientID is not provided', async () => {
            const clientID = ""; // Example invalid clientID
            const updatedData = {
                address1: 'New Address 1',
                address2: 'Updated Address 2',
                city: 'Los Angeles',
                state: 'CA',
                zip: '99999'
            };
    
            // Asserting that calling updateProfile without clientID throws an error
            await expect(db.updateProfile(clientID, updatedData.address1, updatedData.address2, updatedData.city, updatedData.state, updatedData.zip)).rejects.toThrow('clientID is required.');
        });

        test('should update profile data for a valid clientID', async () => {
            const clientID = 99; // Example clientID
            const updatedData = {
                address1: 'New Address 1',
                address2: 'Updated Address 2',
                city: 'Los Angeles',
                state: 'CA',
                zip: '99999'
            };
            const db = dbService.getDbServiceInstance();
            const result = await db.updateProfile(clientID, updatedData.address1, updatedData.address2, updatedData.city, updatedData.state, updatedData.zip);
            expect(result).toBe(true); // Check if the update was successful
            // Optionally, you can add more specific assertions based on the expected behavior
        });
    
        test('should return false for an invalid clientID', async () => {
            const invalidClientID = -1; // Example invalid clientID
            const updatedData = {
                address1: 'Updated Address 1',
                address2: 'Updated Address 2',
                city: 'Los Angeles',
                state: 'CA',
                zip: '99999'
            };
            const db = dbService.getDbServiceInstance();
            const result = await db.updateProfile(invalidClientID, updatedData.address1, updatedData.address2, updatedData.city, updatedData.state, updatedData.zip);
            expect(result).toBe(false); // Check if the update failed
        });

        test('should resolve false if an error occurs during the update', async () => {
            const clientID = 99; // Example clientID
            const updatedData = {
                address1: 'New Address 1',
                address2: 'Updated Address 2',
                city: 'Los Angeles',
                state: 'CA',
                zip: '99999'
            };
    
            // Mocking the connection.query method to simulate an error during the update
            const mockError = new Error('Database query error');
            jest.spyOn(db.getConnection(), 'query').mockImplementation((query, params, callback) => {
                callback(mockError, null);
            });
    
            // Calling the updateProfile function
            const result = await db.updateProfile(clientID, updatedData.address1, updatedData.address2, updatedData.city, updatedData.state, updatedData.zip);
    
            // Asserting that the result is false since an error occurred during the update
            expect(result).toBe(false);
        });
    });
});