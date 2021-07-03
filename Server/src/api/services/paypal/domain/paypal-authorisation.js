const joi=require('joi');

/**
 * Holds and validates the purchase authorisation as per generted by Palpal posted client side to /paypal/execute
 */
class PaypalAuthorisation {
  constructor({
    intent,
    orderID,
    payerID,
    paymentID,
    paymentToken,
    returnUrl,
  } = {}) {
    this.intent = intent;
    this.orderID = orderID;
    this.payerID = payerID;
    this.paymentID = paymentID;
    this.paymentToken = paymentToken;
    this.returnUrl = returnUrl;
  }

  static get CONSTRAINTS() {
    return joi.object({
      intent: joi.string().required(),
      orderID: joi.string().required(),
      payerID: joi.string().required(),
      paymentID: joi.string().required(),
      paymentToken: joi.string().required(),
      returnUrl: joi.string().optional(),
    }).options({ stripUnknown: true });
  }
}

module.exports=PaypalAuthorisation;
