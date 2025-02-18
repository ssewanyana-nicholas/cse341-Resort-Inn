const request = require('supertest');
const { app, startServer, closeServer } = require('../server');
const { initDb, clearDatabase, closeDatabase } = require('../data/connect');

jest.setTimeout(90000); // Set global timeout

describe('Activities API Endpoints', () => {
    let server;

    // Setup
    beforeAll(async () => {
        try {
            // Initialize database first
            await new Promise((resolve, reject) => {
                console.log('Initializing database...');
                initDb((err) => {
                    if (err) {
                        console.error('Database initialization failed:', err);
                        reject(err);
                    } else {
                        console.log('Database initialized successfully');
                        resolve();
                    }
                });
            });

            // Then start server
            console.log('Starting server...');
            server = await startServer();
            console.log('Server started successfully');
        } catch (error) {
            console.error('Setup failed:', error);
            throw error;
        }
    });

    // Cleanup
    afterAll(async () => {
        try {
            console.log('Cleaning up...');
            if (server) {
                await closeServer();
                console.log('Server closed');
            }
            await closeDatabase();
            console.log('Database closed');
        } catch (error) {
            console.error('Cleanup failed:', error);
            throw error;
        }
    });

    // Test GET all activities
    describe('GET /activities', () => {
        it('should return status 200 and an array of activities', async () => {
            const response = await request(app)
                .get('/activities')
                .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            // Additional validation if activities are returned
            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty('_id');
                // Add more specific checks based on your activity model
            }
        }, 30000);
    });

    // Test GET activities by ID
    describe('GET /activities/:id', () => {
        const testIds = [
            '67a41d519f77038705f3a804',
            '67a41d5c9f77038705f3a808',
            '67a68adb337816c6d77e49ae',
            '67ab38451782050056ddd495'
        ];

        testIds.forEach(id => {
            it(`should return status 200 or 404 for activity ID: ${id}`, async () => {
                const response = await request(app)
                    .get(`/activities/${id}`)
                    .set('Accept', 'application/json');

                expect([200, 404]).toContain(response.status);
                
                if (response.status === 200) {
                    expect(response.body).toBeDefined();
                    expect(response.body).toHaveProperty('_id');
                    // Add more specific checks based on your activity model
                }
            },);
        });

        // Test with invalid ID format
        it('should handle invalid ID format appropriately', async () => {
            const response = await request(app)
                .get('/activities/invalidid')
                .set('Accept', 'application/json');
            
            expect([400, 404]).toContain(response.status);
        }, 15000);

        // Test with non-existent ID but valid format
        it('should return 404 for non-existent activity ID', async () => {
            const response = await request(app)
                .get('/activities/507f1f77bcf86cd799439011')
                .set('Accept', 'application/json');
            
            expect(response.status).toBe(404);
        },);
    });

    // Optional: Add tests for edge cases
    describe('Edge Cases', () => {
        it('should handle empty query parameters', async () => {
            const response = await request(app)
                .get('/activities?name=')
                .set('Accept', 'application/json');
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        }, 30000);

        it('should handle special characters in query parameters', async () => {
            const response = await request(app)
                .get('/activities?name=%20')
                .set('Accept', 'application/json');
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        },);
    });
});
