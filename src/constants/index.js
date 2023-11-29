// store all app level constants here

const STATUS_CODES  = {
    SUCCESS : 200,
    SUCCESS_NO_CONTENT : 204,
    NOT_FOUND : 404,
    BAD_REQUEST : 400,
    REQUEST_FAILED :  402,
    FORBIDDEN : 403,
    TOO_MANY_REQUESTS : 429,
    SERVER_ERROR : 500
}

const purchaseSchema = {
    "type": "object",
    "properties": {
      "userId": {
        "type": "string"
      },
      "bookId": {
        "type": "string"
      },
      "quantity": {
        "type": "integer"
      },
      "paymentDetails": {
        "type": "object",
        "properties": {
          "cardNumber": {
            "type": "string"
          },
          "expiryDate": {
            "type": "string"
          },
          "cvv": {
            "type": "string"
          }
        },
        "required": [
          "cardNumber",
          "expiryDate",
          "cvv"
        ]
      }
    },
    "required": [
      "userId",
      "bookId",
      "quantity",
      "paymentDetails"
    ]
}

module.exports={
    STATUS_CODES, purchaseSchema
}