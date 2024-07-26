const User = require('../../models/userModel');
const Book = require('../../models/bookModel');

const createBook = async (req, res) => {
  try {
    const findBook = await Book.findOne({ name: req.body.name })
    if (!findBook) {
      const newBook = new Book(
        {
          name: req.body.name
        }
      );
      await newBook.save();
      res.status(200).send('Book created successfully');
    }
    else {
      res.status(500).json({ success: false, message: "Book already saved" });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find({}, '_id name').sort({ borrowCount: -1 });
    res.status(200).json(books);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
const getBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.bookId }, '_id name score');
    if (book) {
      res.status(200).json(book);
    }
    else {
      res.status(500).json({ success: false, message: "Book Not Found" });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
const borrowBook = async (req, res) => {
  try {
    const [findBook, findUser] = await Promise.all([
      Book.findOne({ _id: req.params.bookId }),
      User.findOne({ _id: req.params.userId })
    ]);
    if (findBook && findUser) {
      if (findBook.isBorrowed) {
        res.status(500).json({ success: false, message: "Book already borrowed" });
      }
      else {
        await User.updateOne(
          { _id: req.params.userId },
          { $push: { 'books.present': findBook.name } }
        );
        await Book.updateOne(
          { _id: req.params.bookId },
          {
            $set: { isBorrowed: true },
          }
        );
        res.status(200).send('Book borrowed successfully');
      }

    }
    else {
      res.status(500).json({ success: false, message: "Book or User Not Found" });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
const returnBook = async (req, res) => {
  try {
    const [findBook, findUser] = await Promise.all([
      Book.findOne({ _id: req.params.bookId }),
      User.findOne({ _id: req.params.userId })
    ]);
    if (findBook && findUser) {
      if (findUser.books.present.includes(findBook.name)) {
        const newScore = findBook.score === -1
          ? req.body.score
          : ((findBook.score * findBook.borrowCount) + req.body.score) / (findBook.borrowCount + 1);

        await Promise.all([
          User.updateOne(
            { _id: req.params.userId },
            {
              $pull: { 'books.present': findBook.name },
              $push: { 'books.past': { name: findBook.name, userScore: req.body.score } }
            }
          ),
          Book.updateOne(
            { _id: req.params.bookId },
            {
              $set: { isBorrowed: false, score: newScore.toFixed(2) },
              $inc: { borrowCount: 1 }
            }
          )
        ]);
        res.status(200).send('Book returned successfully');
      }
      else {
        res.status(500).json({ success: false, message: "User Not Borrowed This Book" });
      }
    }
    else {
      res.status(500).json({ success: false, message: "Book or User Not Found" });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}
module.exports = {
  createBook,
  getBooks,
  getBook,
  borrowBook,
  returnBook
}