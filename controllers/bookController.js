const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const bookService = require('../services/bookService');
const { getErrorMessage } = require('../utils/errorUtils');

router.get('/catalog', async (req, res) => {
   const course = await bookService.getAll();

   res.render('course/catalog', { course });
   // res.render('course/catalog', { course: []}); //for testin if no courses
});

router.get('/create', isAuth, (req, res) => {
   res.render('course/create');
});

router.post('/create', isAuth, async (req, res) => {
   const courseData = req.body;
   try {
      await bookService.create(req.user._id, courseData);
   } catch (error) {
      return res.status(400).render('course/create', { ...courseData, error: getErrorMessage(error), courseData: courseData });

   }

   res.redirect('/course/catalog');
});

//-----------------------------------------------------------------------------//
router.get('/:courseId/details', async (req, res) => {
   const course = await bookService.getOne(req.params.courseId);

   const isOwner = course.owner == req.user?._id;
   const courseOwner = await bookService.findOwner(course.owner).lean();

   const isSign = course.signUpList?.some(user => user._id == req.user?._id);

   const signCount = await bookService.getSignUpUsernames(req.params.courseId);

   res.render('course/details', { course, isOwner, isSign, courseOwner, signCount });
});

router.get('/:courseId/signup', isAuth, async (req, res) => {
   try {
      await bookService.signup(req.user._id, req.params.courseId);
   } catch (error) {
      return res.status(400).render('404', { error: getErrorMessage(error) });
   }

   res.redirect(`/course/${req.params.courseId}/details`);
});


router.get('/:courseId/edit', isAuth, isCourseOwner, async (req, res) => {
   const course = await bookService.getOne(req.params.courseId);

   res.render('course/edit', { ...course });
});


router.post('/:courseId/edit', isAuth, isCourseOwner, async (req, res) => {
   const courseData = req.body;

   try {
      await bookService.edit(req.params.courseId, courseData);
      res.redirect(`/course/${req.params.courseId}/details`);

   } catch (error) {
      return res.render('course/edit', { ...courseData, error: getErrorMessage(error)});
   };

});

router.get('/:courseId/delete', isAuth, isCourseOwner, async (req, res) => {

   await bookService.delete(req.params.courseId);
   res.redirect('/course/catalog')
});




async function isCourseOwner(req, res, next) {
   const course = await bookService.getOne(req.params.courseId);

   if (course.owner != req.user?._id) {
      return res.redirect(`/course/${req.params.courseId}/details`);
   }

   next();
}


module.exports = router;