import Booking from '../../models/booking.js';
import { populateBooking, populateEvent } from './merge.js';

export default {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return populateBooking(booking);
      });
    } catch (err) {
      throw err
    }
  },
  bookEvent: async args => {
    const fetchEvent = await Event.findById({ _id: args.eventId });
    const booking = new Booking({
      user: "655223de9c1fd48a0e636961",
      event: fetchEvent,
    });
    try {
      const result = await booking.save();
      return populateBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async args => {
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
