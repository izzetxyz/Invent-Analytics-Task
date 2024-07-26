const router = require('express').Router();
const userController = require('../controllers/User/userController');
const bookController = require('../controllers/Book/bookController');
const { validateUserId, validateBookId, validateCreateUser, validateCreateBook } = require('../middlewares/validationMiddleware');


router.get('/users', userController.getUsers);

router.get('/users/:userId', validateUserId, userController.getUser);


router.get('/books', bookController.getBooks);


router.get('/books/:bookId', validateBookId, bookController.getBook);


router.post('/users', validateCreateUser, userController.createUser);


router.post('/books', validateCreateBook, bookController.createBook);


router.post('/users/:userId/borrow/:bookId', validateUserId, validateBookId, bookController.borrowBook);

router.post('/users/:userId/return/:bookId', validateUserId, validateBookId, bookController.returnBook);

module.exports = router;
