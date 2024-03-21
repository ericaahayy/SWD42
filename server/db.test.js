const dbService = require("./db");

describe('dbService', () => {
    const db = dbService.getDbServiceInstance();
    afterAll(async () => {
        await db.closeConnection();
    });

    // Test for authenticateUser function
    describe('authenticateUser', () => {
        test('should throw an error if username is missing', async () => {
            // Mock data with missing username
            const username = '';
            const password = 'admin123';
        
            // Call the function and expect it to throw an error
            await expect(db.authenticateUser(username, password)).rejects.toThrow('Username and password are required.');
        });
    
        test('should throw an error if password is missing', async () => {
            // Mock data with missing password
            const username = 'admin@google.com';
            const password = '';
        
            // Call the function and expect it to throw an error
            await expect(db.authenticateUser(username, password)).rejects.toThrow('Username and password are required.');
        });
    
        test('should throw an error if both username and password are missing', async () => {
            // Mock data with missing username and password
            const username = '';
            const password = '';
        
            // Call the function and expect it to throw an error
            await expect(db.authenticateUser(username, password)).rejects.toThrow('Username and password are required.');
        });
    
        test('should not throw an error if both username and password are provided', async () => {
            // Mock valid username and password
            const username = 'admin@google.com';
            const password = 'admin123';
    
            // Call the function and expect it to resolve without throwing an error
            await expect(db.authenticateUser(username, password)).resolves.toBeDefined();
        });

        test('should reject with an error if an error occurs during database query', async () => {
            // Mock data
            const username = 'admin@google.com';
            const password = 'password';
            const mockError = new Error('Unit Test: Username and password do not match');

            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError); // Simulate an error
                })
            });

            await expect(db.authenticateUser(username, password)).rejects.toThrow(mockError.message);
        });
    });  

    //Test for checkUsernameExists function
    describe('checkUsernameExists', () => {
        test('should throw an error if username is missing', async () => {
            // Mock data with missing username
            const username = '';
            
            // Call the function and expect it to throw an error
            await expect(db.checkUsernameExists(username)).rejects.toThrow('Username is required.');
        });

        test('should return false if username does not exist', async () => {
            // Mock data with a non-existing username
            const username = 'fakeuser';
            
            // Call the function and expect it to return false
            const exists = await db.checkUsernameExists(username);
            expect(exists).toBe(false);
        });
    });

    //Test for userRegister function
    describe('userRegister', () => {
        test('should throw an error if username is missing', async () => {
            // Mock data with missing username
            const username = '';
            const password = 'password123';
            const first_login = 1;
        
            // Call the function and expect it to throw an error
            await expect(db.userRegister(username, password, first_login)).rejects.toThrow('Username, password, and first_login are required.');
        });
    
        test('should throw an error if password is missing', async () => {
            // Mock data with missing password
            const username = 'user@example.com';
            const password = '';
            const first_login = 1;
        
            // Call the function and expect it to throw an error
            await expect(db.userRegister(username, password, first_login)).rejects.toThrow('Username, password, and first_login are required.');
        });
    
        test('should throw an error if first_login is missing', async () => {
            // Mock data with missing first_login
            const username = 'user@example.com';
            const password = 'password123';
            const first_login = undefined;
        
            // Call the function and expect it to throw an error
            await expect(db.userRegister(username, password, first_login)).rejects.toThrow('Username, password, and first_login are required.');
        });
    
        test('should not throw an error if all required fields are provided', async () => {
            // Mock valid data
            const username = 'user@example.com';
            const password = 'password123';
            const first_login = 1;
        
            // Mock successful database insertion
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate a successful insertion
                    callback(null, { insertId: 1 }); // Mock insertId
                })
            });
        
            // Call the function and expect it to resolve without throwing an error
            await expect(db.userRegister(username, password, first_login)).resolves.toBeDefined();
        });
        
        test('should throw an error if database insertion fails', async () => {
            // Mock data
            const username = 'user123@example.com';
            const password = 'password123';
            const first_login = true;
            const mockError = new Error('User registration failed');
        
            // Mock error during database insertion
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError, null); // Simulate an error with null result
                })
            });
        
            // Call the function and expect it to throw an error
            await expect(db.userRegister(username, password, first_login)).rejects.toThrow(mockError.message);
        });
    });

    //Test for addProfile function
    describe('addProfile', () => {
        test('should throw an error if any required field is missing', async () => {
            // Mock data with missing required fields
            const username = 'user@example.com';
            const fname = 'John';
            const lname = '';
            const address1 = '123 Main St';
            const address2 = '';
            const city = 'New York';
            const state = 'NY';
            const zipcode = '10001';
            const clientID = '12345';

            // Call the function and expect it to throw an error
            await expect(db.addProfile(username, fname, lname, address1, address2, city, state, zipcode, clientID)).rejects.toThrow('All fields are required.');
        });

        test('should return true if profile is added successfully', async () => {
            // Mock valid data
            const username = 'user@example.com';
            const fname = 'John';
            const lname = 'Doe';
            const address1 = '123 Main St';
            const address2 = '';
            const city = 'Houston';
            const state = 'TX';
            const zipcode = '12345';
            const clientID = '12345';

            // Mock successful database insertion
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    // Simulate a successful insertion
                    callback(null, { affectedRows: 1 }); // Mock affectedRows
                })
            });

            // Call the function and expect it to resolve with true
            await expect(db.addProfile(username, fname, lname, address1, address2, city, state, zipcode, clientID)).resolves.toBe(true);
        });

        test('should return false if database insertion fails', async () => {
            // Mock data
            const username = 'user@example.com';
            const fname = 'John';
            const lname = 'Doe';
            const address1 = '123 Main St';
            const address2 = '';
            const city = 'Houston';
            const state = 'TX';
            const zipcode = '10001';
            const clientID = '12345';
            const mockError = new Error('Error adding profile');

            // Mock error during database insertion
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError, null); // Simulate an error with null result
                })
            });

            // Call the function and expect it to reject with an error
            await expect(db.addProfile(username, fname, lname, address1, address2, city, state, zipcode, clientID)).rejects.toThrow(mockError.message);
        });
    });
    
    //Test for updateFirstLogin function
    describe('updateFirstLogin', () => {
        // Test for missing username
        test('should throw an error if username is missing', async () => {
            // Mock data with missing username
            const username = '';
    
            // Call the function and expect it to throw an error
            await expect(db.updateFirstLogin(username)).rejects.toThrow('Username is required.');
        });
    
        // Test for database update failure
        test('should return false if database update fails', async () => {
            // Mock data
            const username = 'user@example.com';
    
            // Mock error during database update
            const mockError = new Error('Database update failed');
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(mockError); // Simulate an error
                })
            });
    
            // Call the function and expect it to return false
            const result = await db.updateFirstLogin(username);
            expect(result).toBe(false);
        });
    
        // Test for successful database update
        test('should return true if database update succeeds', async () => {
            // Mock data
            const username = 'user@example.com';
    
            // Mock successful database update
            jest.spyOn(db, 'getConnection').mockReturnValue({
                query: jest.fn().mockImplementation((query, params, callback) => {
                    callback(null, { affectedRows: 1 }); // Simulate successful update
                })
            });
    
            // Call the function and expect it to return true
            const result = await db.updateFirstLogin(username);
            expect(result).toBe(true);
        });
    });
});
