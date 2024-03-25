const request = require('supertest');
const { app, closeServer } = require('./server');
const dbService = require("./db");

let db;

    beforeEach(() => {
        db = dbService.getDbServiceInstance();
    });

    afterAll(async () => {
        await db.closeConnection();
    });

describe('Fuel Quote Submission', () => {
    test('should respond with success message upon successful quote submission', async () => {
        // mock data for a fuel quote submission
        const requestBody = {
            galreq: 100,
            deliveryaddress: '123 TEST',
            deliverydate: '2024-03-24',
            suggestedprice: 2.5,
            totaldue: 250,
            clientID: '12345'
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
                deliverydate: '2024-03-24',
                suggestedprice: 2.5,
                totaldue: 250,
                clientID: '12346' // assuming you have a clientID
            });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Internal Server Error');
    });
});