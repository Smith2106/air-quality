import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {type: String, default: 'https://www.esparkinfo.com/wp-content/uploads/2016/08/default-avatar.png'},
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', UserSchema);