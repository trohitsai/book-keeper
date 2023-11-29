const Express = require('express');
const Router = Express.Router();

const BooksController = require('../controllers/books');

Router.use('/v1/books', BooksController);

module.exports = Router;