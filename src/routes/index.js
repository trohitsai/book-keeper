const Express = require('express');

const Router = Express.Router();
const bookRoutes = require('./books')

Router.use(bookRoutes)

module.exports = Router;