import authResolver from './auth.js';
import eventsResolver from './events.js';
import bookingsResolver from './bookings.js';

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingsResolver
}

export default rootResolver;
