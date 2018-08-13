import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    traffic: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

export default mongoose.model('Airport', airportSchema);