const Express = require('express');
const Router = Express.Router({ mergeParams: true });
const BookHandler = require('../handlers/books');
const {purchaseSchema} =  require('../constants')

const { Validator } = require("express-json-validator-middleware");
const { validate } = new Validator();

Router.post('/purchase', validate({ body: purchaseSchema }), async (req, res, next) => {
  try {
    const { statusCode, errors, data } = await BookHandler.purchaseBook(req.body)
    
    if (errors){
      throw errors
    }

    res.status(statusCode).json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = Router;
