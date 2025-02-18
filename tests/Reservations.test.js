const request = require('supertest');
const { app, startServer, closeServer } = require('../server');

jest.setTimeout(90000);
describe('Reservations API Endpoints', () => {
    let server;

    // Setup and teardown
    beforeAll(async () => {
        server = await startServer();
    });

    afterAll(async () => {
        await closeServer();
    });

    // Test GET all reservations
    describe('GET /reservations', () => {
        it('should return status 200 and an array of reservations', async () => {
            const response = await request(app)
                .get('/reservations')
                .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            // Additional validation if reservations are returned
            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty('_id');
                expect(response.body[0]).toHaveProperty('clientId');
                expect(response.body[0]).toHaveProperty('checkInDate');
                expect(response.body[0]).toHaveProperty('checkOutDate');
                // Add more specific checks based on your reservation model
            }
        }, 15000);

        it('should handle query parameters correctly', async () => {
            const response = await request(app)
                .get('/reservations?limit=5')
                .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeLessThanOrEqual(5);
        }, 15000);
    });

    // Test GET reservations by ID
    describe('GET /reservations/:id', () => {
        const testIds = [
            '67a039daff3be0e09fe540ba',
            '67a4330d9fd8cc505f33209e',
            '67a434f09fd8cc505f33209f',
            '67a765601821efd5918c1bef'
        ];

        testIds.forEach(id => {
            it(`should return status 200 or 404 for reservation ID: ${id}`, async () => {
                const response = await request(app)
                    .get(`/reservations/${id}`)
                    .set('Accept', 'application/json');

                expect([200, 404]).toContain(response.status);
                
                if (response.status === 200) {
                    expect(response.body).toBeDefined();
                    expect(response.body).toHaveProperty('_id');
                    expect(response.body).toHaveProperty('clientId');
                    expect(response.body).toHaveProperty('checkInDate');
                    expect(response.body).toHaveProperty('checkOutDate');
                    expect(response.body).toHaveProperty('roomType');
                    expect(response.body).toHaveProperty('totalPrice');
                    // Add more specific checks based on your reservation model
                }
            }, 15000);
        });

        // Test with invalid ID format
        it('should handle invalid ID format appropriately', async () => {
            const response = await request(app)
                .get('/reservations/invalidid')
                .set('Accept', 'application/json');
            
            expect([400, 404]).toContain(response.status);
            if (response.status === 400) {
                expect(response.body).toHaveProperty('error');
            }
        }, 15000);

        // Test with non-existent ID but valid format
        it('should return 404 for non-existent reservation ID', async () => {
            const response = await request(app)
                .get('/reservations/507f1f77bcf86cd799439011')
                .set('Accept', 'application/json');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        }, 15000);
    });
});
