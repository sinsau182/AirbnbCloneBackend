const Booking = require('../models/Booking');

// Books a place
exports.createBookings = async (req, res) => {
  try {
    const userData = req.user;
    const { place, checkIn, checkOut, numOfGuests, name, phone, price } =
      req.body;

    const booking = await Booking.create({
      user: userData.id,
      place,
      checkIn,
      checkOut,
      numOfGuests,
      name,
      phone,
      price,
    });

    res.status(200).json({
      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Returns user specific bookings
exports.getBookings = async (req, res) => {
  try {
    const userData = req.user;
    if (!userData) {
      return res
        .status(401)
        .json({ error: 'You are not authorized to access this page!' });
    }

    const booking = await Booking.find({ user: userData.id }).populate('place')

    res
      .status(200).json({ booking, success: true })


  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Deletes a booking
exports.deleteBookings = async (req, res) => {
  try {
    const userData = req.user;
    const { id } = req.params;

    const booking = await Booking.findOne
      ({ _id: id, user: userData.id });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.remove();

    res.status(200).json({ message: 'Booking deleted successfully' });
  }
  catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
}
