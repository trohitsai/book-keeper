// mock payment function
async function chargeCustomer(cardDetails, price) {
    // using these conditions just to simulate the payment failure cases and show how errors are handled
    if (cardDetails.cardNumber=='4242-4242-4242-4242') {
        return {statusCode:402, errors:{error_code:"insufficient_balance", message:"payment failed due to insufficient balance"}}
    } 
    else if (cardDetails.cardNumber=='4141-4141-4141-4141') {
        return {statusCode:402, errors:{error_code:"card_expired", message:"payment failed due as the card provided is expired"}}
    } 
    else {
        return {statusCode:200, data:{message:"payment successful"}}
    }
}

module.exports={chargeCustomer};