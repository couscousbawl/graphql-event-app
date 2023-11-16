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
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      created_by: "655223de9c1fd48a0e636961",
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = populateEvent(result);
      const created_by = await User.findById("655223de9c1fd48a0e636961");
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
