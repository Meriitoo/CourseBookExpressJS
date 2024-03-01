const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!!!!!!!!!!!!!!'],
        minLength: 2,
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        minLength: 10,
    },
    password: {
        type: String,
        match: [/^[a-zA-Z0-9]+$/, 'Password should be alphanumeric'],
        minLength: [6, 'Password too short'],
        required: [true, 'Password required']
    },
    createdCourse: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course',
    }],
    signedUpCourses: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course',
    }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;

// {
//     virtuals: {
//         repeatPassword: {
//             set(value) {
//                 if (this.password !== value) {
//                     throw new mongoose.Error('Password missmatch');
//                 }
//             }
//         }
//     }
// }
