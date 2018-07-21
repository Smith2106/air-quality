import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

export default mongoose.model("Comment", commentSchema);