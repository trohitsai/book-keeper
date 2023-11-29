const logger = require('../utils/logger');
const booksDB = require('../db/mock_book_availability');
const userDB = require('../db/mock_user_details');
const paymentHandler  = require('../services/payment_gateway/stripe');
const redisHelper  = require('../services/redis');
const { STATUS_CODES } = require('../constants');
const { verifyRequestRateLimits} = require('../utils/helper');


async function purchaseBook(payload) {

    // added redis based rate limiting to avoid duplicate requests
    const isRequestLimitedExceeded = await verifyRequestRateLimits(payload)
    if (isRequestLimitedExceeded){
        logger.error('duplicate request for purchase')
        return {
            statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
            errors: {
                "error_code":"too_many_requests",
                "message": `too many requests received from client`
            }
        };
    }

    // incase requests are duplicate i.e. purchase of same book by same user in short span making sure
    // the requests are idempotent i.e returning same response by querying the DB for the last successful purchase

    // when using MYSQL this can be handled more smartly by using transactional rad/write locks on rows
    const duplicateTransactionId = await redisHelper.getKey(`${payload.userId}_${payload.bookId}_bookingdetails`)
    if(duplicateTransactionId) {
        return {
            statusCode: STATUS_CODES.SUCCESS,
            data: {
                "id": duplicateTransactionId,
                "message":"Purchase successful"
            }
        };
    }

    // check availability of book in inventory first
    logger.info(`checking book ${payload.bookId} availability`)
    currentBookDetails = await booksDB.getBookAvailability(payload.bookId)
    if (currentBookDetails.available_units < payload.quantity) {
        logger.error(`the requested book ${payload.bookId} is out of stock`)
        return {
            statusCode: STATUS_CODES.NOT_FOUND,
            errors: {
                "error_code":"not_available",
                "message": "book is not available and out of stock"
            }
        };
    }

    // mock payment collection function
    logger.info(`intiating payement of amount ${currentBookDetails.price} for book ${payload.bookId} `)
    let {statusCode, data, errors} = await paymentHandler.chargeCustomer(
        payload.paymentDetails, 
        currentBookDetails.price
    )
    if (statusCode!=STATUS_CODES.SUCCESS) {
        return {
            statusCode,
            errors: {
                "error_code":"payment_failed",
                "message": `the payment could not be completed due to ${errors.error_code}`
            }
        };
    }

    // mock DB update fucntion to update user purchase details
    transactonId = await userDB.updateUserPurchaseDetails(payload.userId, payload.bookId)

    // mock DB update book inventory function after successful purchase
    await booksDB.updateBookInventory(payload.bookId)

    return {
        statusCode: STATUS_CODES.SUCCESS,
        data: {
            "id":transactonId,
            "message":"Purchase successful"
        }
    };
}

module.exports = {purchaseBook}