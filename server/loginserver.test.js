const request = require('supertest');
const { app, closeServer } = require('./server');
const dbService = require("./db");

const db = dbService.getDbServiceInstance();
afterAll(async () => {
    await db.closeConnection();
    closeServer();
});

afterEach(async () => {
    await db.deleteEntry('testuser@gmail.com', true);
    await db.deleteEntry('temp@gmail.com', false);
})

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