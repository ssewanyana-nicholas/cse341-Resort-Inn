
const mongodb = require('../data/connect');
const ObjectId = require('mongodb').ObjectId;

// Get all Reservations
const getAllReservation = async (req, res) => {
  //#swagger.tags=['reservations']
  try {
    const { limit = 10, startDate, endDate } = req.query;
    const query = {};

    // Add date range filtering if provided
    if (startDate || endDate) {
      query.checkInDate = {};
      if (startDate) {
        query.checkInDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.checkInDate.$lte = new Date(endDate);
      }
    }

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('reservations')
      .find(query)
      .limit(Number(limit))
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      error: 'Failed to fetch reservations', 
      details: error.message
    });
  }
};

// Get Reservation by Id
const getReservationById = async (req, res) => {
  //#swagger.tags=['reservations']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        error: 'Invalid reservation ID format' 
      });
    }

    const reservationsId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('reservations')
      .findOne({ _id: reservationsId });

    if (!result) {
      return res.status(404).json({ 
        error: 'Reservation not found' 
      });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({
      error: 'Failed to fetch reservation', 
      details: error.message
    });
  }
};

// Get reservation by client ID
const getReservationByClientId = async (req, res) => {
  //#swagger.tags=['reservations']
  try {
    if (!ObjectId.isValid(req.params.clientId)) {
      return res.status(400).json({ 
        error: 'Invalid client ID format' 
      });
    }

    const clientId = new ObjectId(req.params.clientId);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('reservations')
      .find({ clientId })
      .toArray();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching reservations by client:', error);
    res.status(500).json({
      error: 'Failed to fetch reservations', 
      details: error.message
    });
  }
};

// Add a new reservation
const addReservation = async (req, res) => {
  //#swagger.tags=['reservations']
  try {
    const { clientId, roomType, checkInDate, checkOutDate, status, totalPrice, paymentStatus } = req.body;

    // Validate required fields
    if (!clientId || !roomType || !checkInDate || !checkOutDate || 
        !status || !totalPrice || !paymentStatus) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Validate clientId format
    if (!ObjectId.isValid(clientId)) {
      return res.status(400).json({ 
        error: 'Invalid clientId format' 
      });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ 
        error: 'Invalid date format' 
      });
    }

    if (checkIn >= checkOut) {
      return res.status(400).json({ 
        error: 'Check-out date must be after check-in date' 
      });
    }

    const reservationData = {
      clientId: new ObjectId(clientId),
      roomType,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      status,
      totalPrice: Number(totalPrice),
      paymentStatus,
      createdAt: new Date()
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('reservations')
      .insertOne(reservationData);

    res.status(201).json({ 
      message: 'Reservation added successfully', 
      reservationId: result.insertedId 
    });
  } catch (error) {
    console.error('Error adding reservation:', error);
    res.status(500).json({ 
      error: 'Failed to add reservation', 
      details: error.message 
    });
  }
};

// Update a reservation
const updateReservation = async (req, res) => {
  //#swagger.tags=['reservations']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        error: 'Invalid reservation ID format' 
      });
    }

    const reservationId = new ObjectId(req.params.id);
    const { clientId, roomType, checkInDate, checkOutDate, status, totalPrice, paymentStatus } = req.body;

    // Validate at least one field is provided
    if (!clientId && !roomType && !checkInDate && !checkOutDate && 
        !status && totalPrice === undefined && !paymentStatus) {
      return res.status(400).json({ 
        error: 'At least one field must be provided for update' 
      });
    }

    const updateData = {};

    // Validate and process each field
    if (clientId) {
      if (!ObjectId.isValid(clientId)) {
        return res.status(400).json({ 
          error: 'Invalid clientId format' 
        });
      }
      updateData.clientId = new ObjectId(clientId);
    }

    if (roomType) updateData.roomType = roomType;

    if (checkInDate) {
      const checkIn = new Date(checkInDate);
      if (isNaN(checkIn.getTime())) {
        return res.status(400).json({ 
          error: 'Invalid check-in date format' 
        });
      }
      updateData.checkInDate = checkIn;
    }

    if (checkOutDate) {
      const checkOut = new Date(checkOutDate);
      if (isNaN(checkOut.getTime())) {
        return res.status(400).json({ 
          error: 'Invalid check-out date format' 
        });
      }
      updateData.checkOutDate = checkOut;
    }

    if (status) updateData.status = status;
    if (totalPrice !== undefined) updateData.totalPrice = Number(totalPrice);
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    updateData.updatedAt = new Date();

    const result = await mongodb
      .getDatabase()
      .db()
      .collection('reservations')
      .updateOne({ _id: reservationId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        error: 'Reservation not found' 
      });
    }

    res.status(200).json({ 
      message: 'Reservation updated successfully' 
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ 
      error: 'Failed to update reservation', 
      details: error.message 
    });
  }
};

// Delete reservation
const deleteReservation = async (req, res) => {
  //#swagger.tags=['reservations']
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        error: 'Invalid reservation ID format' 
      });
    }

    const reservationId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection('reservations')
      .deleteOne({ _id: reservationId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        error: 'Reservation not found' 
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ 
      error: 'Failed to delete reservation', 
      details: error.message 
    });
  }
};

module.exports = {
  getAllReservation,
  getReservationById,
  getReservationByClientId,
  addReservation,
  updateReservation,
  deleteReservation
};
