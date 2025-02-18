require('dotenv').config({
    path: '.env.test'
});

jest.setTimeout(90000); // Increase global timeout

const { initDb, clearDatabase, closeDatabase } = require('./data/connect');

beforeAll(async () => {
    await new Promise((resolve, reject) => {
        initDb((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}, 90000);

afterEach(async () => {
    if (process.env.NODE_ENV === 'test') {
        await clearDatabase();
    }
}, 60000);

afterAll(async () => {
    await closeDatabase();
}, 90000);
