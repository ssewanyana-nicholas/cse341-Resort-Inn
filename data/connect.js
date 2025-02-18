const dotenv = require('dotenv');
dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const MongoClient = require('mongodb').MongoClient;

let database;

const initDb = (callback) => {
    if (database) {
        console.log('Database is already initialized!');
        return callback(null, database);
    }

    const uri = process.env.NODE_ENV === 'test' 
        ? process.env.MONGODB_URI.replace('cse341_team', 'cse341_team_test')
        : process.env.MONGODB_URI;

    MongoClient.connect(uri, {
        serverSelectionTimeoutMS: 60000, // Increase timeout here
        connectTimeoutMS: 60000,         // Increase timeout here
    })
        .then((client) => {
            database = client;
            console.log(`Connected to ${process.env.NODE_ENV === 'test' ? 'test' : 'production'} database`);
            callback(null, database);
        })
        .catch((err) => {
            console.error('Database connection error:', err);
            callback(err);
        });
};

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized');
    }
    return database;
};

const closeDatabase = async () => {
    if (database) {
        try {
            await database.close();
            database = null;
            console.log('Database connection closed');
        } catch (err) {
            console.error('Error closing database:', err);
            throw err;
        }
    }
};

// Clean up function for tests
const clearDatabase = async () => {
    if (process.env.NODE_ENV !== 'test') {
        throw Error('clearDatabase can only be called in test environment');
    }

    if (!database) {
        throw Error('Database not initialized');
    }

    try {
        const collections = await database.db().collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
        console.log('Test database cleared');
    } catch (err) {
        console.error('Error clearing test database:', err);
        throw err;
    }
};

module.exports = {
    initDb,
    getDatabase,
    closeDatabase,
    clearDatabase: process.env.NODE_ENV === 'test' ? clearDatabase : undefined
};
