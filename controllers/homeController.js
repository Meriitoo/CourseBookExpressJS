const router = require('express').Router();
bookService = require('../services/bookService');
const { isAuth } = require('../middlewares/authMiddleware');
const userService = require('../services/userService');

router.get('/', async (req, res) => {
    const latestCourses = await bookService.getLatest().lean();

    res.render('home', { latestCourses });
});

router.get('/profile', isAuth, async (req, res) => {
    const user = await userService.getInfo(req.user._id).lean();

    const createdCoursesCount = user.createdCourse.length;
    const signUpCoursesCount = user.signedUpCourses.length;

    res.render('course/profile', { user, createdCoursesCount, signUpCoursesCount });
});

module.exports = router;