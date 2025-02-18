const mongodb = require('../data/connect');
const ObjectId = require('mongodb').ObjectId;

//get all Activities
const getAllActivities = async (req, res) => {
  //#swagger.tags=['activities']
  try {
    const result = await mongodb.getDatabase().db().collection('activities').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching activities', 
      error: error.message
    });
  }
};

//get Activity By Id
const getActivityById = async (req, res) => {
  //#swagger.tags=['activities']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid activity ID format' 
      });
    }

    const activitiesId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('activities')
      .findOne({ _id: activitiesId });

    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ 
        message: 'Activity not found' 
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching activity', 
      error: error.message
    });
  }
};

// Add a new activity
const addActivity = async (req, res) => {
  //#swagger.tags=['activities']
  try {
    const { activityName, description, schedule, capacity, price, status } = req.body;

    if (!activityName || !description || !schedule || !capacity || !price || status === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    const newActivity = {
      activityName,
      description,
      schedule,
      capacity,
      price,
      status,
      createdAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('activities')
      .insertOne(newActivity);

    res.status(201).json({ 
      message: 'Activity added successfully', 
      activityId: result.insertedId 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error adding activity',
      error: error.message 
    });
  }
};

// Update an activity
const updateActivity = async (req, res) => {
  //#swagger.tags=['activities']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid activity ID format' 
      });
    }

    const activityId = new ObjectId(req.params.id);
    const { activityName, description, schedule, capacity, price, status } = req.body;

    if (!activityName || !description || !schedule || !capacity || !price || status === undefined) {
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    const updateActivity = {
      activityName,
      description,
      schedule,
      capacity,
      price,
      status,
      updatedAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('activities')
      .replaceOne({ _id: activityId }, updateActivity);

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        message: 'Activity not found' 
      });
    }

    res.status(200).json({ 
      message: 'Activity updated successfully' 
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating activity',
      error: error.message 
    });
  }
};

const deleteActivity = async (req, res) => {
  //#swagger.tags=['activities']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid activity ID format' 
      });
    }

    const activityId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db()
      .collection('activities')
      .deleteOne({ _id: activityId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ 
        message: 'Activity not found' 
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting activity', 
      error: error.message
    });
  }
};

module.exports = {
  getAllActivities,
  getActivityById,
  addActivity,
  updateActivity,
  deleteActivity
};

