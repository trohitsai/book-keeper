const redisHelper  = require('../services/redis');
const logger = require('../utils/logger');

async function getUserDetails(userId) {
    // mock user purchase details to simulate purchase checks
    if (userId == 3000) {
        return {
            "id":"3000",
            "books":[
                {
                    id: 1001,
                    quantity: 1
                }
            ],
            "name":"john"
        }
    } else if (userId == 3001) {
        return {
            "id":"3001",
            "books":[],
            "name":"smith"
        }
    } else if (userId == 3002) {
        return {
            "id":"3002",
            "books":[
                {
                    id: 1001,
                    quantity: 1
                },
                {
                    id: 1003,
                    quantity: 1
                }
            ],
            "name":"mark"
        }
    }
} 

async function checkAlreadyPurchased(userId, bookID) {
    details = await getUserDetails(userId)
    if (details.books) {
        for (const book of details.books) {
            if(book.id==bookID && book.quantity>0){
                return true
            }
        }
    }
    return false
}

async function updateUserPurchaseDetails(userId, bookId) {
    logger.info(`updating purchase details of book ${bookId} for user ${userId} `)
    // when using mysql transactionId will ideally be a table primary key
    let transactonId = (new Date()).getTime().toString(36) 
    let bookingDetailsCache = await redisHelper.getKey(`${userId}_${bookId}_bookingdetails`)
    if (!bookingDetailsCache){
        await redisHelper.setKeyWithExpiry(`${userId}_${bookId}_bookingdetails`, 10, transactonId)
    } else {
        transactonId = bookingDetailsCache
    }
    return transactonId
}

module.exports={
    getUserDetails, 
    checkAlreadyPurchased, 
    updateUserPurchaseDetails
};