const dbService = require("./db");

describe('dbService', () => {
    const db = dbService.getDbServiceInstance();
    afterAll(async () => {
        await db.closeConnection();
    });

    describe('getProfileData', () => {
        test('should throw an error if clientID is missing', async () => {
            // Mock data with missing clientID
            const clientID = '';

            // Call the function and expect it to throw an error
            await expect(db.getProfileData(clientID)).rejects.toThrow('clientID is required.');
        });

        test('should return profile data if clientID is provided', async () => {
            // Mock clientID
            const clientID = '1345'; // Assuming this is the clientID in your system

            // Mock profile data
            const mockProfileData = {
                username: 'mockusername',
                address1: 'mockaddress1',
                address2: 'mockaddress2',
                city: 'mockcity',
                state: 'mockstate',
                zip: 'mockzip'
                // Add other profile data as needed
            };

            // Mock successful database retrieval
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate a successful retrieval
                    callback(null, [mockProfileData]); // Mock result
                })
            });

            // Call the function and expect it to resolve with profile data
            await expect(db.getProfileData(clientID)).resolves.toEqual(mockProfileData);
        });

        test('should return null if profile data is not found for the provided clientID', async () => {
            // Mock clientID
            const clientID = 'nonexistentClientID';

            // Mock database retrieval returning empty result
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate an empty result
                    callback(null, []); // Mock empty result
                })
            });

            // Call the function and expect it to resolve with null
            await expect(db.getProfileData(clientID)).resolves.toBeNull();
        });

        test('should reject with an error if an error occurs during database query', async () => {
            // Mock clientID
            const clientID = '1345'; // Assuming this is the clientID in your system
            const mockError = new Error('Database query error');

            // Mock error during database retrieval
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError); // Simulate an error
                })
            });

            // Call the function and expect it to reject with an error
            await expect(db.getProfileData(clientID)).rejects.toThrow(mockError.message);
        });
    });

    describe('updateProfile', () => {
        test('should throw an error if clientID is missing', async () => {
            // Mock data with missing clientID
            const clientID = '';
            const address1 = 'updatedAddress1';
            const address2 = 'updatedAddress2';
            const city = 'updatedCity';
            const state = 'updatedState';
            const zip = 'updatedZip';

            // Call the function and expect it to throw an error
            await expect(db.updateProfile(clientID, address1, address2, city, state, zip)).rejects.toThrow('clientID is required.');
        });

        test('should update profile successfully if clientID and all fields are provided', async () => {
            // Mock clientID and updated profile data
            const clientID = '1345'; // Assuming this is the clientID in your system
            const address1 = 'updatedAddress1';
            const address2 = 'updatedAddress2';
            const city = 'updatedCity';
            const state = 'updatedState';
            const zip = 'updatedZip';

            // Mock successful database update
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate a successful update
                    callback(null, { affectedRows: 1 }); // Mock affectedRows
                })
            });

            // Call the function and expect it to resolve with true
            await expect(db.updateProfile(clientID, address1, address2, city, state, zip)).resolves.toBe(true);
        });

        test('should return false if database update fails', async () => {
            // Mock clientID and updated profile data
            const clientID = '1345'; // Assuming this is the clientID in your system
            const address1 = 'updatedAddress1';
            const address2 = 'updatedAddress2';
            const city = 'updatedCity';
            const state = 'updatedState';
            const zip = 'updatedZip';
            const mockError = new Error('Database update error');

            // Mock error during database update
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError); // Simulate an error
                })
            });

            // Call the function and expect it to reject with an error
            await expect(db.updateProfile(clientID, address1, address2, city, state, zip)).rejects.toThrow(mockError.message);
        });
    });
});
//missing 235-241,244