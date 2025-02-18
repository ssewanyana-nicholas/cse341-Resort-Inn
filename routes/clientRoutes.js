const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middlewares/auth');
const { joiValidation } = require('../middlewares/joi');
const passport = require('passport');





// validation
const { clients, activities, reservations, restaurants } = require('../middlewares/validation_schema');



//swagger
router.use('/', require('./swagger'));


//controllers for collections
const clientsController = require('../controllers/clients');
const activitiesController = require('../controllers/Activities');
const reservationsController = require('../controllers/Reservations');
const restaurantsController = require('../controllers/Restaurants');

//Routes for clients

// Routes for clients
router.get('/clients', joiValidation(clients.getAll), clientsController.getClients);
router.get('/clients/:id',  joiValidation(clients.getOne), clientsController.getClientsById);
router.delete('/clients/:id',  joiValidation(clients.deleteOne), clientsController.deleteClient);

// Routes for activities
router.get('/activities',  joiValidation(activities.getAll), activitiesController.getAllActivities);
router.get('/activities/:id', joiValidation(activities.getOne), activitiesController.getActivityById);
router.delete('/activities/:id',  joiValidation(activities.deleteOne), activitiesController.deleteActivity);

// Routes for reservations
router.get('/reservations',  joiValidation(reservations.getAll), reservationsController.getAllReservation);
router.get('/reservations/:id',  joiValidation(reservations.getOne), reservationsController.getReservationById);
router.get('/reservations/client/:clientId',  joiValidation(reservations.getByClientId), reservationsController.getReservationByClientId);
router.delete('/reservations/:id',  joiValidation(reservations.deleteOne), reservationsController.deleteReservation);


// Routes for restaurants
router.get('/restaurants',  joiValidation(restaurants.getAll), restaurantsController.getAllRestaurants);
router.get('/restaurants/:id', joiValidation(restaurants.getOne), restaurantsController.getRestaurantById);
//router.get('/restaurants/reservations/clientId', restaurants.getReservationsByClientId, restaurantsController.getRestaurantReservationsByClient);
router.delete('/restaurants/:id', ensureAuthenticated, joiValidation(restaurants.deleteOne), restaurantsController.deleteRestaurant);


// POST to add a new activity
router.post('/activities', ensureAuthenticated, joiValidation(activities.createOne), activitiesController.addActivity);

// PUT to update an activity
router.put('/activities/:id', ensureAuthenticated, joiValidation(activities.updateOne), activitiesController.updateActivity);

// POST to add a new client
router.post('/clients', ensureAuthenticated, joiValidation(clients.createOne), clientsController.addClient);

// PUT to update a client
router.put('/clients/:id', ensureAuthenticated, joiValidation(clients.updateOne), clientsController.updateClient);

// POST to add a new reservation
router.post('/reservations/', ensureAuthenticated, joiValidation(reservations.createOne), reservationsController.addReservation);

// PUT to update a reservation
router.put('/reservations/:id', ensureAuthenticated, joiValidation(reservations.updateOne), reservationsController.updateReservation);

// POST to add a new restaurant
router.post('/restaurants/', ensureAuthenticated, joiValidation(restaurants.createOne), restaurantsController.addRestaurant);

// PUT to update a restaurant
router.put('/restaurants/:id', ensureAuthenticated, joiValidation(restaurants.updateOne), restaurantsController.updateRestaurant);

router.get('/login', passport.authenticate('github'), (req, res) => {});

router.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


module.exports = router;
