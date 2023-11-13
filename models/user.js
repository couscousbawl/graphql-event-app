import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
   email: {
    type: String,
    required: true
   },
   password: {
    type: String,
    required: true
   },
   createdEvents: [
    {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }
   ]
});

const model = mongoose.model('User', userSchema);
export const schema = model.schema;
export default model;