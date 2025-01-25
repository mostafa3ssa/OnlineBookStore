const express = require('express');
const userRoutes = require('./routes/user');
const connectToDatabase = require('./db');
const app = express();
const path = require('path');
const { UserModel } = require('./models/user');
const { CategoryModel } = require('./models/category');
const {addBook, getBookDetails} = require('./controllers/book');
const {addCart, getTotalAmount} = require('./controllers/cart');
const {addBookToCart, removeBookFromCart, removeAllItems} = require('./controllers/cartItem');
const {addCategory} = require('./controllers/category');
const {addUserBook, getUserBooks} = require('./controllers/userBooks');
const {addOrder} = require('./controllers/order');
const {addOrderDetails} = require('./controllers/orderHistory');
const {addBank, getBankName} = require('./controllers/bank');
const { BookModel } = require('./models/book');
const {Belongs, BelongsModel} = require('./models/bookBelongsToCategory'); 
const session = require('express-session');
const { CartModel } = require('./models/cart');
const {Order, OrderModel} = require('./models/order');
const {OrderHistory, OrderHistoryModel} = require('./models/orderHistory');
const {CartItem, CartItemModel} = require('./models/cartItem'); 
const {Notification, NotificationModel} = require('./models/notification');
const {sendNotification, getNotificationDetails, getAllNotifications} = require('./controllers/notification');
const {UserBook, UserBooksModel} = require('./models/userBooks');
const { BankModel } = require('./models/bank');
const { request } = require('http');
const { getBookReviews, addBookReview } = require('./controllers/bookReviews');
const { addSiteRanking, getSiteRankings } = require('./controllers/siteRanking');
const { getBookCategories, getCategoryBooks } = require('./controllers/bookBelongsToCategory');
const { sendIssue } = require('./controllers/support');
const { siteRankingModel } = require('./models/siteRanking');
const { BookReviewsModel } = require('./models/bookReviews');
const { SupportModel } = require('./models/support');
async function startServer() {
  await connectToDatabase();
}

startServer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(
    session({
        secret: 'c!w74*#P9Z@k&r1G',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
);

const egyptBanks = [
  "National Bank of Egypt",
  "Banque Misr",
  "Commercial International Bank (CIB)",
  "QNB Alahli",
  "Arab African International Bank (AAIB)",
  "Banque du Caire",
  "AlexBank",
  "HSBC Egypt",
  "Faisal Islamic Bank of Egypt",
  "Abu Dhabi Islamic Bank (ADIB)"
];

app.use('/user', userRoutes);

app.get('/user/register', (req, res) => {
  res.render('user/register');
});

app.get('/deleteAllUsers', async (req, res) => {
  await UserModel.deleteMany();
  console.log('dn');
  res.render('user/register');
})

app.get('/viewAllUsers', async (req, res) => {
  const users = await UserModel.find();
  res.render('viewAllUsers', {users});
});

app.get('/addingALotOfBooks', async (req, res) => {


  // BOOKS: 

  //////////////

  for (let i = 0; i < books.length; i++) {
      const mybook = await addBook(books[i].title, books[i].genre, books[i].author, books[i].price, books[i].isbn, books[i].description, books[i].createdAt, books[i].categories);
  }
  res.send("done");
});

app.get('/viewAllBooks', async (req, res) => {
  const mybooks = await BookModel.find({});
  res.send(mybooks);
}); 

app.get('/viewAllBelongs', async (req, res) => {
  const mybooksCategories = await BelongsModel.find({});
  res.send(mybooksCategories);
});

app.get('/addingCategories', async(req, res) => {
  for(let i = 0; i < categories.length; ++i) {
    const myCategory = await addCategory(categories[i].categoryName, categories[i].categoryDescription);
  }
  res.send("done");
});

app.get('/viewCategories', async(req, res) => {
    const categories = await CategoryModel.find({});
    res.send(categories);
});

app.get('/deleteAllCategories', async (req, res) => {
    const categories = await CategoryModel.deleteMany();
    res.redirect('/viewCategories');
});

app.get('/deleteAllBooks', async (req, res) => {
    const books = await BookModel.deleteMany();
    res.redirect('/viewAllBooks');
});
app.get('/', async (req, res) => {
    const myBooks = await BookModel.find({});
    let allBooks = [];
    for(let i = 0; i < myBooks.length; ++i) {
      const bookId = myBooks[i]._id;
      const orders = await OrderHistoryModel.find({bookId});
      const book = myBooks[i];
      const numberOfOrders = orders.length;
      allBooks.push({book, numberOfOrders});
    }

    allBooks.sort((a, b) => b.numberOfOrders - a.numberOfOrders);
    let books = [];
    for(let i = 0; i < 10; ++i) {
      books.push(allBooks[i].book);
    }

    const myRatings = await getSiteRankings();
    let rankings = [];
    for(let i = 0; i < myRatings.length; ++i) {
      const rating = myRatings[i].rating;
      const text = myRatings[i].text;
      const user = await UserModel.findById(myRatings[i].userId);
      let userName = user.firstName;
      if(req.session.userId == myRatings[i].userId) userName = "You";
      const date = myRatings[i].date;
      const ranking = {
        text,
        rating,
        userName,
        date
      };
      rankings.push(ranking);
    }
    const pageTitle = "Best Sellers";
    res.render('home', { user: req.session.userId || null, books, rankings, pageTitle });
});




app.get('/search', async (req, res) => {
    const query = req.query.q;
    const myRatings = await getSiteRankings();
    console.log(myRatings);
    let rankings = [];
    for(let i = 0; i < myRatings.length; ++i) {
      const rating = myRatings[i].rating;
      const text = myRatings[i].text;
      const user = await UserModel.findById(myRatings[i].userId);
      let userName = user.firstName;
      if(req.session.userId == myRatings[i].userId) userName = "You";
      const date = myRatings[i].date;
      const ranking = {
        text,
        rating,
        userName,
        date
      };
      rankings.push(ranking);
    }
    const pageTitle = `You have searched for "${query}"`;
    try {
        const books = await BookModel.find({ title: { $regex: query, $options: 'i' } });
        res.render('home', { books, user: req.session.userId, rankings, pageTitle });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.render('home', { books: [], user: req.session.userId, rankings, pageTitle });
    }
}); 

app.get('/searchCategory/:categoryName', async (req, res) => {
  const categoryName = req.params.categoryName;
  const category = await CategoryModel.findOne({categoryName});
  const pageTitle = `You have searched for "${categoryName}"`;
  const categoryId = category._id;
  const mybooks = await getCategoryBooks(categoryId);
  let books = [];
  for(let i = 0; i < mybooks.length; ++i) {
    const myBook = await BookModel.findById(mybooks[i].bookId);
    if(myBook)
      books.push(myBook);
  }
  const myRatings = await getSiteRankings();
    // console.log(myRatings);
    let rankings = [];
    for(let i = 0; i < myRatings.length; ++i) {
      const rating = myRatings[i].rating;
      const text = myRatings[i].text;
      const user = await UserModel.findById(myRatings[i].userId);
      let userName = user.firstName;
      if(req.session.userId == myRatings[i].userId) userName = "You";
      const date = myRatings[i].date;
      const ranking = {
        text,
        rating,
        userName,
        date
      };
      rankings.push(ranking);
    } 

    res.render('home', { books, user: req.session.userId, rankings, pageTitle });
});

app.get('/contactSupport', async (req, res) => {
  if(!req.session.userId) {
    return res.render('user/login');
  }
  res.render('contactSupport');
});

app.post('/sendIssue', async (req, res) => {
  const userId = req.session.userId;
  const type = req.body.type;
  const message = req.body.message || req.body.issue;
  await sendIssue(userId, type, message);
  console.log(message);
  res.redirect('/');
});

app.get('/viewAllOrders', async (req, res) => { 
  const orders = await OrderModel.find({});
  res.send(orders);
});
app.get('/notifications', async (req, res) => {
  if(!req.session.userId) {
    return res.render('user/login');
  }
  const userId = req.session.userId;
  const notifications = await getAllNotifications(userId);
  res.render('notifications', {notifications});
});

app.get('/makeRead/:id', async (req, res) => {
  const id = req.params.id;
  const noti = await NotificationModel.findByIdAndUpdate(
      id, 
      { isRead: true }, // The update to apply
      { new: true }     // Return the updated document
  );
  res.redirect('/notifications');
});

app.get('/removeNotifications', async (req, res) => {
  if(!req.session.userId) {
    return res.render('user/login');
  }
  const userId = req.session.userId;
  const noti = await NotificationModel.deleteMany({userId});
  res.redirect('/notifications');
});

app.get('/viewBook/:id', async (req, res) => {
    const bookId = req.params.id;
    const userId = req.session.userId || null;
    const bookData = await getBookDetails(bookId);
    const bookReviews = await getBookReviews(bookId);
    const bookCategories = await getBookCategories(bookId);
    const title = bookData.title;
    const imageUrl = bookData.imageUrl;
    const author = bookData.author;
    const genre = bookData.genre;
    const price = bookData.price;
    const description = bookData.description;
    let status = "Add to Cart";
    let nameOfCurrentUser = "";
    if(req.session.userId) {
      const myCart = await getTotalAmount(userId);
      const cartId = myCart._id;
      const item = await CartItemModel.findOne({cartId, userId, bookId});
      const purchased = await UserBooksModel.findOne({bookId, userId});
      const thisUser = await UserModel.findById(userId); 
      nameOfCurrentUser = thisUser.firstName;
      if(item) {
        status = "Added to the Cart";
      }
      else if(purchased) {
        status = "Purchased";
      }
    }
    console.log(title);
    let reviews = [];
    for(let i = 0; i < bookReviews.length; ++i) {
      const user = await UserModel.findOne(bookReviews[i].userId);
      let userName = user.firstName;
      if(bookReviews[i].userId == userId) userName = "You";
      const review = {
        text: bookReviews[i].text,
        date: bookReviews[i].date,
        name: userName
      };
      reviews.push(review);
    }

    let categories = [];
    for(let i = 0; i < bookCategories.length; ++i) {
      const category = await CategoryModel.findById(bookCategories[i].categoryId);
      const categoryName = category.categoryName;
      categories.push(categoryName);
    }
    res.render('viewBook', { bookId, userId, title, imageUrl, author, genre, price, description, status, reviews, categories });
});

app.post('/addComment', async (req, res) => {
  const { bookId, text } = req.body;
  console.log(req.body);
  if(!req.session.userId) {
    return res.redirect('/user/login');
  }
  const userId = req.session.userId;
  console.log("ReivewText: ");
  console.log(text);
  const myReview = await addBookReview(bookId, userId, text);
  console.log(myReview);
  res.redirect(`/viewBook/${bookId}`);
  // res.json(myReview);
});

app.get('/viewCart', async (req, res) => {
  const userId = req.session.userId;
  // console.log(userId);
  if(!req.session.userId) {
    return res.render('user/login');
  }
  const myCart = await getTotalAmount(userId);
  const cartId = myCart._id;
  let totalAmount = 0;
  console.log("Cart from the app.js: ");
  console.log(cartId);
  const items = await CartItemModel.find({cartId, userId});
  
  const bookDetailsList = await Promise.all(
            items.map(async (item) => {
                const bookDetails = await getBookDetails(item.bookId); // Fetch book details for each item.
                const book = {
                  id: bookDetails._id,
                  title: bookDetails.title,
                  price: bookDetails.price,
                  image: "/images/photoBook.jpeg"
                };
                totalAmount+=bookDetails.price;
                return book; // Return only the book details.
            })
        );
  console.log(totalAmount);
  myCart.totalAmount = totalAmount;
  res.render('viewCart', {bookDetailsList, userId, cartId, totalAmount});
});


app.get('/addCartItem/:id', async (req, res) => {
  const userId = req.session.userId;
  const bookId = req.params.id;
  if(!req.session.userId) {
    return res.render('user/login');
  }
  const myCart = await getTotalAmount(userId);
  const cartId = myCart._id;
  console.log("From additem: ");
  console.log(myCart);
  const item = await addBookToCart(userId, cartId, bookId);
  console.log("Your item: ");
  console.log(item);
  res.redirect('/viewCart');
});

app.get('/deletCartItem/:id', async (req, res) => {
  const userId = req.session.userId;
  const bookId = req.params.id;
  if(!req.session.userId) {
    return res.render('user/login');
  }
  const myCart = await getTotalAmount(userId);
  const cartId = myCart._id;
  console.log("From removeitem: ");
  console.log(myCart);
  const item = await removeBookFromCart(userId, cartId, bookId);
  console.log("Your item: ");
  console.log(item);
  res.redirect('/viewCart');
});
app.get('/viewCarts', async (req, res) => {
  const carts = await CartModel.find({});
  res.send(carts);
}); 

app.get('/deleteAllNotifications', async (req, res) => {
  const noti = await NotificationModel.deleteMany({});
  res.send(noti);
});

app.get('/addBanks', async (req, res) => {
  for(let i = 0; i < egyptBanks.length; ++i) {
    const bankName = egyptBanks[i];
    const bank = await addBank(bankName);
  }
  res.send("done");
});

app.get('/viewBanks', async (req, res) => {
  const banks = await BankModel.find({});
  console.log("hello");
  res.json(banks);
  // res.send('done');
}); 
app.get('/checkout', async (req, res) => {
  if(!req.session.userId) {
    return res.redirect('user/login');
  }
  const banks = await BankModel.find({});
  res.render('paymenrProcessing', {banks});
});

app.post('/addOrder', async (req, res) => {
  if(!req.session.userId) {
    return res.render('user/login');
  }
  const userId = req.session.userId;
  const items = await CartItemModel.find({userId});
  console.log("FROM ADD ORDER: ");
  console.log(items);
  const myCart = await getTotalAmount(userId);
  const price = myCart.totalAmount;
  const bankId = req.body.bank;
  const myOrder = await addOrder(userId, bankId, price);
  const orderId = myOrder._id;
  console.log(myOrder);
  for(let i = 0; i < items.length; ++i) {
    const bookId = items[i].bookId;
    await addOrderDetails(userId, bankId, bookId, orderId);
    await addUserBook(bookId, userId);
  }
  console.log("your params: ")
  console.log(req.body.bank);

  await removeAllItems(userId);
  res.status(200).json({ message: 'Order added successfully' });
});

app.post('/addRanking', async (req, res) => {
    const { comment, stars } = req.body;

    if (!req.session.userId) {
        return res.status(500).send('An error occurred while adding the ranking.');
    }

    const userId = req.session.userId;

    try {
        const newRanking = await addSiteRanking(userId, comment, stars);

        console.log('New Ranking Added:', newRanking);

        res.status(200).send("Done");
    } catch (error) {
        console.error('Error adding ranking:', error);
        res.status(500).send('An error occurred while adding the ranking.');
    }
});

app.get('/viewUserBooks', async (req, res) => {
  if(!req.session.userId) {
    return res.render('user/login');
  }
  const userId = req.session.userId;
  const books = await getUserBooks(userId);
  // res.json(books);
  res.render('viewUserBooks', {books});
});

app.get('/del', async (req, res) => {
  await NotificationModel.deleteMany({});
  await OrderModel.deleteMany({});
  await OrderHistoryModel.deleteMany({});
  await siteRankingModel.deleteMany({});
  await SupportModel.deleteMany({});
  await UserBooksModel.deleteMany({});
  await BookReviewsModel.deleteMany({});
  await CartModel.deleteMany({});
  res.send("DONE");  
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

