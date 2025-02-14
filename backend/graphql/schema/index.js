import { buildSchema } from 'graphql';

export default buildSchema(`
type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    created_by: User!
}
type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}
type Auth {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}
input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}
input UserInput {
    email: String!
    password: String!
}
type RootQuery {
    events: [Event!]!
    users: [User!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): Auth!
}
type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)