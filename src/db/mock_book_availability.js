const logger = require('../utils/logger');

async function getBookAvailability(bookID) {

    // mock book details to simulate purchase checks on inventory availability
    if (bookID == 1000) {
        return {
            "id":"2000",
            "bookID":1000,
            "available_units":2,
            "price": 1000
        }
    } else if (bookID == 1001) {
        return {
            "id":"2001",
            "bookID":1001,
            "available_units":1,
            "price": 1000
        }
    } else if (bookID == 1002) {
        return {
            "id":"2002",
            "bookID":1002,
            "available_units":0,
            "price": 1000
        }
    }
} 

async function updateBookInventory(bookID) {
    logger.info(`updating inventory for book ${bookID}`)
    return true
}

module.exports= {getBookAvailability, updateBookInventory};