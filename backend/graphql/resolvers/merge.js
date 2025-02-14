import Event from "../../models/event.js";
import User from '../../models/user.js';
import { dateToString } from "../../helpers/date.js";
import DataLoader from "dataloader";

const eventLoader = new DataLoader(eventIds => {
  return events(eventIds)
});

const userLoader = new DataLoader(userIds => {
  return User.find({_id: {$in: userIds}});
});


export const populateEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    created_by: user.bind(this, event.created_by),
  };
};

export const populateUser = user => {
    return {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user.createdEvents),
      };
  };

export const populateBooking = booking => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
    return events.map(event => {
      return populateEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};
