import Event from "../../models/event.js";
import User from "../../models/user.js";
import { populateEvent } from "./merge.js";

export default {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return populateEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthorized operation');
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      created_by: req.userId,
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = populateEvent(result);
      const created_by = await User.findById(req.userId);
      if (!created_by) {
        throw new Error("User not found!");
      }
      created_by.createdEvents.push(event);
      await created_by.save();
      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
