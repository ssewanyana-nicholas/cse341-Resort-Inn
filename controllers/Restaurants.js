const mongodb = require('../data/connect');
const ObjectId = require('mongodb').ObjectId;

//get all Restaurants
const getAllRestaurants = async (req, res) => {
  //#swagger.tags=['restaurants']
  try {
    const result = await mongodb.getDatabase().db().collection('restaurants').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve restaurants', 
      error: error.message
    });
  }
};

//get Restaurants by ID
const getRestaurantById = async (req, res) => {
  //#swagger.tags=['restaurants']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid restaurant ID format' 
      });
    }

    const restaurantId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('restaurants')
      .findOne({ _id: restaurantId });

    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ 
        message: 'Restaurant not found' 
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve restaurant', 
      error: error.message
    });
  }
};

// Add a new restaurant
const addRestaurant = async (req, res) => {
  //#swagger.tags=['restaurants']
  try {
    const { restaurantName, cuisineType, menu, reservations, location } = req.body;

    if (!restaurantName || !cuisineType || !menu || !reservations || !location) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    //format menu
    const formattedMenu = menu.map((item) => ({
      itemName: item.itemName,
      price: Number(item.price),
      dietaryInfo: Array.isArray(item.dietaryInfo) ? item.dietaryInfo : []
    }));

    //reservations
    const formattedReservations = Array.isArray(reservations)
      ? reservations.map((res) => ({
          reservationDate: new Date(res.reservationDate),
          numOfGuests: Number(res.numOfGuests),
          status: res.status
        }))
      : [];

    const restaurantData = {
      restaurantName,
      cuisineType,
      menu: formattedMenu,
      reservations: formattedReservations,
      location,
      createdAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('restaurants')
      .insertOne(restaurantData);

    res.status(201).json({ 
      message: 'Restaurant added successfully', 
      restaurantId: result.insertedId 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to add restaurant', 
      error: error.message 
    });
  }
};

// Update a restaurant
const updateRestaurant = async (req, res) => {
  //#swagger.tags=['restaurants']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid restaurant ID format' 
      });
    }

    const restaurantId = new ObjectId(req.params.id);
    const { restaurantName, cuisineType, menu, reservations, location } = req.body;

    if (!restaurantName && !cuisineType && !menu && !reservations && !location) {
      return res.status(400).json({ 
        message: 'At least one field must be provided for update' 
      });
    }

    const updateData = {
      updatedAt: new Date()
    };

    if (restaurantName) updateData.restaurantName = restaurantName;
    if (cuisineType) updateData.cuisineType = cuisineType;
    if (menu && Array.isArray(menu)) {
      updateData.menu = menu.map((item) => ({
        itemName: item.itemName,
        price: Number(item.price),
        dietaryInfo: Array.isArray(item.dietaryInfo) ? item.dietaryInfo : []
      }));
    }
    if (reservations && Array.isArray(reservations)) {
      updateData.reservations = reservations.map((res) => ({
        reservationDate: new Date(res.reservationDate),
        numOfGuests: Number(res.numOfGuests),
        status: res.status
      }));
    }
    if (location) updateData.location = location;

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('restaurants')
      .updateOne({ _id: restaurantId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        message: 'Restaurant not found' 
      });
    }

    res.status(200).json({ 
      message: 'Restaurant updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update restaurant', 
      error: error.message 
    });
  }
};

const deleteRestaurant = async (req, res) => {
  //#swagger.tags=['restaurants']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid restaurant ID format' 
      });
    }

    const restaurantId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('restaurants')
      .deleteOne({ _id: restaurantId });

    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ 
        message: 'Restaurant not found' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete restaurant', 
      error: error.message 
    });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant
};
