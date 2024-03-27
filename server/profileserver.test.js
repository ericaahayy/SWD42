const request = require('supertest');
const { app, closeServer } = require('./server');
const dbService = require("./db");

const db = dbService.getDbServiceInstance();
afterAll(async () => {
    await db.closeConnection();
    closeServer();
});

describe('Profile API', () => {
    test('should respond with profile data if clientID is provided', async () => {
        // Mock clientID for testing
        const mockClientID = 'mockClientID';

        // Mock profile data to be returned from the database
        const mockProfileData = {
            username: 'mockusername',
            address1: 'mockaddress1',
            address2: 'mockaddress2',
            city: 'mockcity',
            state: 'mockstate',
            zip: 'mockzip'
            // Add other profile data as needed
        };

        // Mock the getProfileData method to return mockProfileData
        jest.spyOn(db, 'getProfileData').mockResolvedValue(mockProfileData);

        // Send request to the profile API endpoint
        const response = await request(app)
            .get('/api/profile')
            .query({ clientID: mockClientID });

        // Assert response status code
        expect(response.status).toBe(200);

        // Assert response body contains the expected profile data
        expect(response.body).toEqual(mockProfileData);
    });

    test('should respond with 401 status if clientID is not provided', async () => {
        // Send request to the profile API endpoint without clientID
        const response = await request(app)
            .get('/api/profile');

        // Assert response status code
        expect(response.status).toBe(401);
        // Add additional assertions as needed
    });

    // Add more test cases as needed
});

//update_profile

test('should respond with success message if profile is updated successfully', async () => {
    // Mock clientID and updated profile data for testing
    const mockClientID = '1345';
    const updatedProfileData = {
        address1: 'updatedAddress1',
        address2: 'updatedAddress2',
        city: 'updatedCity',
        state: 'updatedState',
        zip: 'updatedZip'
    };

    // Mock the updateProfile method to return true, indicating successful update
    jest.spyOn(db, 'updateProfile').mockResolvedValue(true);

    // Send request to the update_profile API endpoint
    const response = await request(app)
        .put('/api/update_profile')
        .send({
            clientID: mockClientID,
            ...updatedProfileData
        });

    // Assert response status code
    expect(response.status).toBe(200);

    // Assert response body contains the success message
    expect(response.body.message).toBe('Profile updated successfully');
});

//missing lines 169-172, 199-183