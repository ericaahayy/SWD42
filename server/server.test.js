const request = require('supertest');
const { app, closeServer } = require('./server');
const dbService = require("./db");

const db = dbService.getDbServiceInstance();

afterEach(async () => {
    await db.deleteEntry('testuser@gmail.com', "profile");
    await db.deleteEntry('temp@gmail.com', "login");
    await db.deleteEntry('99', "fuelquote");
})

afterAll(async () => {
    await db.closeConnection();
    closeServer();
});

describe('Login API', () => {
    test('should respond with success message if login is successful', async () => {
        // Assuming valid login credentials
        const response = await request(app) 
            .post('/api/login')
            .send({
                username: 'admin@google.com',
                password: 'admin123'
            });

        // Assuming the login API responds with a success message
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login successful'); // Adjust according to your actual response
        expect(response.body.data).toBeDefined(); // Assuming you're returning user data upon successful login
    });

    test('should respond with 400 status if username or password is missing', async () => {
        // Sending a request without username and password
        const response = await request(app)
            .post('/api/login')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username and password are required.');
    });

    test('should respond with 401 status if username or password is incorrect', async () => {
        // Sending a request with incorrect username or password
        const response = await request(app)
            .post('/api/login')
            .send({
                username: 'invalid@example.com',
                password: 'invalidpassword'
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Username and password do not match'); // Adjust according to your actual response
    });
});

describe('User Registration API', () => {
    // Test for missing username, password, or first_login
    test('should respond with error message if required fields are missing', async () => {
        // Mock data with missing required fields
        const requestBody = {
            // Missing username, password, and first_login
        };

        // Send request to register user
        const response = await request(app)
            .post('/user/register')
            .send(requestBody);

        // Assert response status code and message
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username, password, and first_login are required.');
    });

    // Test for existing username
    test('should respond with error message if username already exists', async () => {
        // Mock data with existing username
        const requestBody = {
            username: 'admin@google.com',
            password: 'admin123',
            first_login: 0
        };

        // Send request to register user
        const response = await request(app)
            .post('/user/register')
            .send(requestBody);

        // Assert response status code and message
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email already exists');
    });
   
    // Test for successful user registration
    test('should respond with success message if user is registered successfully', async () => {
        // Mock data for a new user registration
        const requestBody = {
            username: 'temp@gmail.com',
            password: 'password123',
            first_login: 1
        };

        // Send request to register user
        const response = await request(app)
            .post('/user/register')
            .send(requestBody);

        // Assert response status code and message
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User registered successfully');
    });

    // Test for internal server error
    test('should respond with error message if internal server error occurs', async () => {
        // Mock data for a new user registration
        const requestBody = {
            username: 'error@example.com',
            password: 'password123',
            first_login: 'Error'
        };

        // Mock the checkUsernameExists method to throw an error
        jest.spyOn(db, 'checkUsernameExists').mockRejectedValue(new Error('Database connection error'));

        // Send request to register user
        const response = await request(app)
            .post('/user/register')
            .send(requestBody);

        // Assert response status code and message
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
    });
});

describe('Add Profile API', () => {
    test('should respond with success message if profile is added successfully', async () => {
        // Assuming valid profile data
        const response = await request(app)
            .post('/api/add_profile')
            .send({
                username: 'testuser@gmail.com',
                fname: 'John',
                lname: 'Doe',
                address1: '123 Main St',
                city: 'Houston',
                state: 'TX',
                zipcode: '12345',
                clientID: '15' // Should match an ID from login table
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Profile added successfully and first login updated');
    });

    test('should respond with 400 status if any required field is missing', async () => {
        // Sending a request without some required fields
        const response = await request(app)
            .post('/api/add_profile')
            .send({
                // Missing some required fields
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('All fields are required.');
    });

    test('should respond with 500 status if failed to add profile', async () => {
        // Assuming an error occurs during profile addition
        const response = await request(app)
            .post('/api/add_profile')
            .send({
                username: 'testuser@example.com', // Assuming this username already exists
                fname: 'John',
                lname: 'Doe',
                address1: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                zipcode: '12345',
                clientID: '123456' // Assuming you have a clientID
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
    });
});

describe('Fuel Quote Submission', () => {
    test('should respond with success message upon successful quote submission', async () => {
        // mock data for a fuel quote submission
        const requestBody = {
            galreq: 100,
            deliveryaddress: '123 Fake Ln',
            deliverydate: '2024-07-30',
            suggestedprice: 2.5,
            totaldue: 250,
            clientID: '99'
        };

        // send request to submit fuel quote
        const response = await request(app)
            .post('/fuelquote/submit_quote')
            .send(requestBody);

        // assert response status code and message
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true); 
    });

    test('should respond with 400 status if any required field is missing', async () => {
        // sending a request without some required fields
        const response = await request(app)
            .post('/fuelquote/submit_quote')
            .send({
                // missing some required fields
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Please fill in required information.');
    });

    test('should respond with 500 status if failed to submit fuel quote', async () => {
        // assuming an error occurs during fuel quote submission
        const response = await request(app)
            .post('/fuelquote/submit_quote')
            .send({
                galreq: 100,
                deliveryaddress: '123 TEST',
                deliverydate: '2024-07-30',
                suggestedprice: 2.5,
                totaldue: 250,
                clientID: '12346' // assuming you have a clientID
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
    });
});

describe('Profile API', () => {
    test('should respond with profile data if clientID is provided', async () => {
        // Assuming a valid clientID
        const clientID = '0'; // Use an existing clientID from your database

        // Send request to fetch profile data
        const response = await request(app)
            .get(`/api/profile?clientID=${clientID}`);

        // Assert response status code and data
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined(); // Assuming your profile data structure
    });

    test('should respond with 401 status if clientID is missing', async () => {
        // Send request without clientID
        const response = await request(app)
            .get('/api/profile');

        // Assert response status code and message
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Unauthorized, clientID not provided');
    });

    test('should respond with 404 status if profile data not found', async () => {
        // Assuming an invalid clientID
        const clientID = '999999'; // Use a non-existent clientID

        // Send request to fetch profile data
        const response = await request(app)
            .get(`/api/profile?clientID=${clientID}`);

        // Assert response status code and message
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Profile data not found');
    });
});

describe('Update Profile API', () => {
    test('should respond with success message upon successful profile update', async () => {
        // Mock data for updating profile
        const requestBody = {
            clientID: '99', // Assuming a valid clientID
            address1: 'Updated Address 1',
            address2: 'New Address 2',
            city: 'Los Angeles',
            state: 'CA',
            zip: '99999'
        };

        // Send request to update profile
        const response = await request(app)
            .put('/api/update_profile')
            .send(requestBody);

        // Assert response status code and message
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Profile updated successfully');
    });

    test('should respond with 500 status if internal server error occurs', async () => {
        // Mocking database error
        jest.spyOn(db, 'updateProfile').mockRejectedValue(new Error('Database error'));

        // Mock data for updating profile
        const requestBody = {
            clientID: '15', // Assuming a valid clientID
            address1: 'Updated Address 1',
            address2: 'Updated Address 2',
            city: 'Los Angeles',
            state: null,
            zip: '99999'
        };

        // Send request to update profile
        const response = await request(app)
            .put('/api/update_profile')
            .send(requestBody);

        // Assert response status code and message
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
    });
});

describe('History API', () => {
    test('should respond with fuel history data if clientID is provided', async () => {
        // Assuming a valid clientID
        const clientID = '0'; // Use an existing clientID from your database

        // Send request to fetch fuel history data
        const response = await request(app)
            .get(`/api/history?clientID=${clientID}`);

        // Assert response status code and data
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined(); // Assuming your fuel history data structure
    });

    test('should respond with 400 status if clientID is missing', async () => {
        // Send request without clientID
        const response = await request(app)
            .get('/api/history');

        // Assert response status code and message
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('clientID is required.');
    });

    test('should respond with 200 status if quoteID is provided', async () => {
        // Assuming a valid clientID and quoteID
        const clientID = '12345'; // Use an existing clientID from your database
        const quoteID = '1'; // Use an existing quoteID from your database

        // Send request to fetch fuel history data based on quoteID
        const response = await request(app)
            .get(`/api/history?clientID=${clientID}&quoteID=${quoteID}`);

        // Assert response status code and data
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined(); // Assuming your fuel history data structure
    });

    test('should respond with 200 status if startDate and endDate are provided', async () => {
        // Assuming a valid clientID, startDate, and endDate
        const clientID = '12345'; // Use an existing clientID from your database
        const startDate = '2024-03-01';
        const endDate = '2024-03-31';

        // Send request to fetch fuel history data based on date range
        const response = await request(app)
            .get(`/api/history?clientID=${clientID}&startDate=${startDate}&endDate=${endDate}`);

        // Assert response status code and data
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined(); // Assuming your fuel history data structure
    });

    test('should return fuel history data for valid clientID when quoteID is empty', async () => {
        // Mocked fuel history data
        const clientID = '0'; // Assuming a valid clientID

        // Mock the dbService to return fuel history data
        const mockFuelHistory = [
            { quoteID: 1, galreq: 100.00, suggestedprice: 2.50, totaldue: 250.00, deliveryaddress: '123 Address Ln', deliverydate: '2024-07-30' },
            { quoteID: 2, galreq: 50.00, suggestedprice: 2.50, totaldue: 125.00, deliveryaddress: '123 Address Dr', deliverydate: '2024-03-22' }
        ];
        jest.spyOn(dbService.getDbServiceInstance(), 'getFuelHistory').mockResolvedValue(mockFuelHistory);

        // Send request to fetch fuel history data with a valid clientID and empty quoteID
        const response = await request(app)
            .get(`/api/history?clientID=${clientID}&quoteID=`);

        // Assert response status code and fuel history data
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });
});