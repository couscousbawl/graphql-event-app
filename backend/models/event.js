import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema({
    title: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const model = mongoose.model('Event', eventSchema);
export const schema = model.schema;
export default model;