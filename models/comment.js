import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: String,
    createdAt: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

export default mongoose.model("Comment", commentSchema);