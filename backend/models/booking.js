import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true } );

const model = mongoose.model('Booking', bookingSchema);
export const schema = model.schema;
export default model;