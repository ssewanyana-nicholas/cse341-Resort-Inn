const request = require('supertest');
const { app, startServer, server } = require('../server');

// Setup and teardown
beforeAll(async () => {
    await startServer();
});

afterAll(async () => {
    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }
});

describe('Clients API Endpoints', () => {
    // Test GET all clients
    describe('GET /clients', () => {
        it('should return status 200 and an array of clients', async () => {
            const res = await request(app).get('/clients');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        }, 10000);
    });

    // Test GET clients by ID
    describe('GET /clients/:id', () => {
        const testIds = [
            '67a411e73f4076a8ed85af71',
            '67a4a5d763f69ae95069344c',
            '67a558a3f8f9b44517b24245',
            '67a559c4f8f9b44517b24247'
        ];

        testIds.forEach(id => {
            it(`should return status 200 or 404 for client ID: ${id}`, async () => {
                const res = await request(app).get(`/clients/${id}`);
                expect([200, 404]).toContain(res.status);
                if (res.status === 200) {
                    expect(res.body).toBeDefined();
                }
            }, 10000);
        });

        // Test with invalid ID format
        it('should handle invalid ID format appropriately', async () => {
            const res = await request(app).get('/clients/invalidid');
            expect([400, 404]).toContain(res.status);
        }, 10000);
    });
});
