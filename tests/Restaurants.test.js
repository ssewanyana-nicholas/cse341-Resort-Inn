const request = require('supertest');
const { app, startServer, closeServer } = require('../server');
const { initDb, closeDatabase } = require('../data/connect');

jest.setTimeout(30000); // Set global timeout

describe('Restaurants API Endpoints', () => {
    let server;

    // Setup and teardown
    beforeAll(async () => {
        try {
            await new Promise((resolve, reject) => {
                initDb((err) => err ? reject(err) : resolve());
            });
            server = await startServer();
        } catch (error) {
            console.error('Setup failed:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            await closeServer();
            await closeDatabase();
        } catch (error) {
            console.error('Cleanup failed:', error);
            throw error;
        }
    });

    // Test GET all restaurants
    describe('GET /restaurants', () => {
        it('should return status 200 and an array of restaurants', async () => {
            const response = await request(app)
                .get('/restaurants')
                .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            
            // Additional validation if restaurants are returned
            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty('_id');
                expect(response.body[0]).toHaveProperty('restaurantName');
                expect(response.body[0]).toHaveProperty('cuisineType');
                expect(response.body[0]).toHaveProperty('location');
                expect(response.body[0]).toHaveProperty('menu');
                expect(response.body[0]).toHaveProperty('reservations');
            }
        });

        it('should handle pagination correctly', async () => {
            const response = await request(app)
                .get('/restaurants?limit=5')
                .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeLessThanOrEqual(5);
        });
    });

    // Test GET restaurants by ID
    describe('GET /restaurants/:id', () => {
        const testIds = [
            '67a039e8ff3be0e09fe540bc',
            '67a540674e38a68ce592c25a',
            '67af86477d3e194db566577e',
            '67af866f7d3e194db566577f'
        ];

        testIds.forEach(id => {
            it(`should return status 200 or 404 for restaurant ID: ${id}`, async () => {
                const response = await request(app)
                    .get(`/restaurants/${id}`)
                    .set('Accept', 'application/json');

                expect([200, 404]).toContain(response.status);
                
                if (response.status === 200) {
                    expect(response.body).toBeDefined();
                    expect(response.body).toHaveProperty('_id');
                    expect(response.body).toHaveProperty('restaurantName');
                    expect(response.body).toHaveProperty('cuisineType');
                    expect(response.body).toHaveProperty('location');
                    expect(response.body).toHaveProperty('menu');
                    expect(response.body).toHaveProperty('reservations');
                }
            });
        });

        // Test with invalid ID format
        it('should handle invalid ID format appropriately', async () => {
            const response = await request(app)
                .get('/restaurants/invalidid')
                .set('Accept', 'application/json');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Invalid restaurant ID format');
        });

        // Test with non-existent ID but valid format
        it('should return 404 for non-existent restaurant ID', async () => {
            const response = await request(app)
                .get('/restaurants/507f1f77bcf86cd799439011')
                .set('Accept', 'application/json');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Restaurant not found');
        });
    });
});
