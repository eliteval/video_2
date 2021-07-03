const joi=require('joi');

/**
 * Hold and validates information about the purchase being posted client side to /paypal/create
 */
class Order {
  constructor({
    orderId,
    amount,
    description,
  } = {}) {
    this.orderId = orderId;
    this.amount = amount;
    this.description = description;
  }

  static get CONSTRAINTS() {
    return joi.object({
      orderId: joi.number().required(),
      amount: joi.number().min(0).required(),
      description: joi.string().required(),
    }).options({ stripUnknown: true });
  }
}
module.exports =Order;
