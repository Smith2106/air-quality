import mongoose from 'mongoose';

const airportSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

export default mongoose.model('Airport', airportSchema);