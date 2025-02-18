
require('dotenv').config();
const express = require('express');
const session = require('express-session');
//const MongoStore = require('connect-mongo');
const mongodb = require('./data/connect');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.NODE_ENV === 'test' ? 3001 : (process.env.PORT || 3000);
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Middleware
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use('/', require('./routes/clientRoutes'));

// Passport configuration
passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
(accessToken, refreshToken, profile, done) => {
    console.log('GitHub profile:', profile);
    return done(null, profile);
}));

// Routes
app.get('/', (req, res) => {
    res.send(
        req.session.user !== undefined
            ? `Logged in as ${req.session.user.displayName}`
            : 'Logged Out'
    );
});

app.get('auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

app.get(
    '/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/api-docs',
      session: false,
    }),
    (req, res) => {
      req.session.user = req.user;
      res.redirect('/api-docs');
    }
  );

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

let server;

// Database connection and server start
const startServer = async () => {
    try {
        await new Promise((resolve, reject) => {
            mongodb.initDb((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        return new Promise((resolve) => {
            server = app.listen(port, () => {
                console.log(`Server running on port ${port}`);
                resolve(server);
            });
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        throw err;
    }
};

// Server shutdown function
const closeServer = async () => {
    if (server) {
        await new Promise((resolve) => {
            server.close(() => {
                console.log('Server closed');
                resolve();
            });
        });
    }
};

// Only start the server if this file is run directly
if (require.main === module) {
    startServer().catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
}

// Export app, startServer and closeServer for testing
module.exports = { app, startServer, closeServer };
