const Course = require('../models/Course');
const User = require('../models/User');

exports.getAll = () => Course.find({}).lean(); //from documents to objects

exports.create = async (ownerId, courseData) => {
    const createdCourse = await Course.create({ ...courseData, owner: ownerId });

    await User.findByIdAndUpdate(ownerId, {$push : {createdCourse: createdCourse._id}});

    return createdCourse;
}


exports.getOne = (courseId) => Course.findById(courseId).lean();

exports.getLatest = () => Course.find().sort({createdAt: -1}).limit(3);

exports.edit = (courseId, courseData) => Course.findByIdAndUpdate(courseId, courseData, { runValidators: true });

exports.signup = async (userId, courseId) => {
    const course = await Course.findById(courseId); 
    const user = await User.findById(userId);
    //Todo: if user already sign in the course
    course.signUpList.push(userId);
    user.signedUpCourses.push(courseId);

    await course.save();
    await user.save();

    // await Course.findByIdAndUpdate(courseId, { $push: { signUpList: userId }}); 
};

exports.delete = (courseId) => Course.findByIdAndDelete(courseId);

exports.findOwner = (userId) => User.findById(userId);

exports.getSignUpUsernames = (courseId) => {
    return Course.findById(courseId).populate('signUpList', 'username').lean().then(course => {
        return course.signUpList.map(user => user.username).join(', ');
    });
};

//await after lean can't
//first lean after is await awai ..... lean ok
// first const some = .....lean and after await some --> can't be done