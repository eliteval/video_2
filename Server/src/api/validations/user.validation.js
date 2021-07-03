const Joi = require('joi');
const User = require('../models/user.model');

module.exports = {

  // GET /v1/users
  listUsers: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      id: Joi.number(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      room: Joi.string(),
      email: Joi.string(),
      phoneNumber: Joi.string(),
      role: Joi.string().valid(User.roles),
      permission: Joi.string(),
      status: Joi.string(),
      image: Joi.string(),
      createdAt: Joi.date(),
    },
  },

  // POST /v1/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().min(8).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(User.roles),
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: {
      email: Joi.string().required(),
      role: Joi.string().valid(User.roles),
    //  room: Joi.string().required(),

      status: Joi.string().required()
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
