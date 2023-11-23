import Booking from '../../models/booking.js';
import Event from '../../models/event.js';
import { populateBooking, populateEvent } from './merge.js';

export default {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized operation');
    }
    try {
      const bookings = await Booking.find({user: req.userId});
      return bookings.map(booking => {
        return populateBooking(booking);
      });
    } catch (err) {
      throw err
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized operation');
    }
    const fetchEvent = await Event.findById({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchEvent,
    });
    try {
      const result = await booking.save();
      return populateBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized operation');
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = populateEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err
    }
  }
};
