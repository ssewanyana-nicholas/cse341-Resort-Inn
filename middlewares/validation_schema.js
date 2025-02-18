const Joi = require('joi');

// Clients
const getClientsSchema = Joi.object({
  params: Joi.object().optional(),
  query: Joi.object().optional(),
  body: Joi.object().optional()
}).unknown(true);
const getClientByIdSchema = Joi.object({
  body: Joi.object().optional(),
  query: Joi.object().optional(),
  params: Joi.object({
    id: Joi.string().required()
  }).required()
}).unknown(true);



const deleteClientSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  body: Joi.object().optional(),
  query: Joi.object().optional()
}).unknown(true);


const createClientSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    membershipLevel: Joi.string().required(),
    preferences: Joi.object({
      roomType: Joi.string().required(),
      dietaryRestrictions: Joi.array().items(Joi.string()),
      preferredActivities: Joi.array().items(Joi.string())
    }).required(),
    loyaltyPoints: Joi.number().required()
  }).required(),
  params: Joi.object().optional(),
  query: Joi.object().optional()
}).unknown(true);


const updateClientSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  body: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    membershipLevel: Joi.string().required(),
    preferences: Joi.object({
      roomType: Joi.string().required(),
      dietaryRestrictions: Joi.array().items(Joi.string()),
      preferredActivities: Joi.array().items(Joi.string())
    }).required(),
    loyaltyPoints: Joi.number().required()
  }).required(),
  query: Joi.object().optional()
}).unknown(true);


// Activities
const getActivitiesSchema = Joi.object({
  params: Joi.object().optional(),
  query: Joi.object().optional(),
  body: Joi.object().optional()
}).unknown(true);

const getActivityByIdSchema = Joi.object({
  body: Joi.object().optional(),
  query: Joi.object().optional(),
  params: Joi.object({
    id: Joi.string().required()
  }).required()
}).unknown(true);

const deleteActivitySchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  body: Joi.object().optional(),
  query: Joi.object().optional()
}).unknown(true);


const createActivitySchema = Joi.object({
  body: Joi.object({
    activityName: Joi.string().required(),
    description: Joi.string().required(),
    schedule: Joi.array().items(
      Joi.object({
        day: Joi.string().required(),
        time: Joi.string().required()
      })
    ).required(),
    capacity: Joi.number().required(),
    price: Joi.number().required(),
    status: Joi.string().required()
  }).required(),
  params: Joi.object().optional(),
  query: Joi.object().optional()
}).unknown(true);


const updateActivitySchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  body: Joi.object({
    activityName: Joi.string().required(),
    description: Joi.string().required(),
    schedule: Joi.array().items(
      Joi.object({
        day: Joi.string().required(),
        time: Joi.string().required()
      })
    ).required(),
    capacity: Joi.number().required(),
    price: Joi.number().required(),
    status: Joi.string().required()
  }).required(),
  query: Joi.object().optional()
}).unknown(true);


// Reservations
const getReservationsSchema = Joi.object({
  params: Joi.object().optional(),
  query: Joi.object().optional(),
  body: Joi.object().optional()
}).unknown(true);


const getReservationByIdSchema = Joi.object({
  body: Joi.object().optional(),
  query: Joi.object().optional(),
  params: Joi.object({
    id: Joi.string().required()
  }).required()
}).unknown(true);

const getReservationsByClientIdSchema = Joi.object({
  params: Joi.object({
    clientId: Joi.string().required()
  }).required(),
  body: Joi.object().optional(),
  query: Joi.object().optional()
}).unknown(true);


const deleteReservationSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  body: Joi.object().optional(),
  query: Joi.object().optional()
}).unknown(true);


const createReservationSchema = Joi.object({
  body: Joi.object({
    clientId: Joi.string().required(),
    roomType: Joi.string().required(),
    checkInDate: Joi.string().isoDate().required(),
    checkOutDate: Joi.string().isoDate().required(),
    status: Joi.string().required(),
    totalPrice: Joi.number().required(),
    paymentStatus: Joi.string().required()
  }).required(),
  params: Joi.object().optional(),
  query: Joi.object().optional()
}).unknown(true);


const updateReservationSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  body: Joi.object({
    clientId: Joi.string().required(),
    roomType: Joi.string().required(),
    checkInDate: Joi.string().isoDate().required(),
    checkOutDate: Joi.string().isoDate().required(),
    status: Joi.string().required(),
    totalPrice: Joi.number().required(),
    paymentStatus: Joi.string().required()
  }).required(),
  query: Joi.object().optional()
}).unknown(true);


// Restaurants
const getRestaurantsSchema = Joi.object({
  params: Joi.object().optional(),
  query: Joi.object().optional(),
  body: Joi.object().optional()
}).unknown(true);


const getRestaurantByIdSchema = Joi.object({
  body: Joi.object().optional(),
  query: Joi.object().optional(),
  params: Joi.object({
    id: Joi.string().required()
  }).required()
}).unknown(true);

const deleteRestaurantSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  body: Joi.object().optional(),
  query: Joi.object().optional()
}).unknown(true);


const createRestaurantSchema = Joi.object({
  body: Joi.object({
    restaurantName: Joi.string().required(),
    cuisineType: Joi.string().required(),
    menu: Joi.array().items(
      Joi.object({
        itemName: Joi.string().required(),
        price: Joi.number().required(),
        dietaryInfo: Joi.array().items(Joi.string()).required()
      })
    ).required(),
    reservations: Joi.array().items(
      Joi.object({
        reservationDate: Joi.string().isoDate().required(),
        numOfGuests: Joi.number().required(),
        status: Joi.string().required()
      })
    ).required(),
    location: Joi.string().required()
  }).required(),
  params: Joi.object().optional(),
  query: Joi.object().optional()
}).unknown(true);


const updateRestaurantSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required()
  }).required(),
  body: Joi.object({
    restaurantName: Joi.string().required(),
    cuisineType: Joi.string().required(),
    menu: Joi.array().items(
      Joi.object({
        itemName: Joi.string().required(),
        price: Joi.number().required(),
        dietaryInfo: Joi.array().items(Joi.string()).required()
      })
    ).required(),
    reservations: Joi.array().items(
      Joi.object({
        reservationDate: Joi.string().isoDate().required(),
        numOfGuests: Joi.number().required(),
        status: Joi.string().required()
      })
    ).required(),
    location: Joi.string().required()
  }).required(),
  query: Joi.object().optional()
}).unknown(true);




module.exports = {
  clients: {
    getAll: getClientsSchema,
    getOne: getClientByIdSchema,
    deleteOne: deleteClientSchema,
    createOne: createClientSchema,
    updateOne: updateClientSchema,
  },
  activities: {
    getAll: getActivitiesSchema,
    getOne: getActivityByIdSchema,
    deleteOne: deleteActivitySchema,
    createOne: createActivitySchema,
    updateOne: updateActivitySchema,
  },
  reservations: {
    getAll: getReservationsSchema,
    getOne: getReservationByIdSchema,
    getByClientId: getReservationsByClientIdSchema,
    deleteOne: deleteReservationSchema,
    createOne: createReservationSchema,
    updateOne: updateReservationSchema,
  },
  restaurants: {
    getAll: getRestaurantsSchema,
    getOne: getRestaurantByIdSchema,
    deleteOne: deleteRestaurantSchema,
    createOne: createRestaurantSchema,
    updateOne: updateRestaurantSchema,
  },
};