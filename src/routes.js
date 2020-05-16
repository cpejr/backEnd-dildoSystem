const express = require('express');
const routes = express.Router();
const UserController = require('./controllers/UserController');
const ProductController = require('./controllers/ProductController');
const SessionController = require('./controllers/SessionController');
const DriveController = require('./controllers/DriveController');
const { authenticateToken, isAdmin } = require('./middlewares/authentication');
const { celebrate, Segments, Joi } = require('celebrate');

//Users
routes.get('/users', UserController.index);
routes.post('/user', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    type: Joi.string().valid("admin", "retailer", "wholesaler").required(),
    cpf: Joi.string().required(),
    birthdate: Joi.string().optional(),
    zipcode: Joi.string().optional(),
    phonenumber: Joi.string().optional(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    neighborhood: Joi.string().optional(),
    street: Joi.string().optional(),
    number: Joi.string().optional(),
    complement: Joi.string().optional(),
  })
}), UserController.create);

//Session
routes.post('/login', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  })
}), SessionController.signin);

//Product
routes.post('/newProduct', authenticateToken, isAdmin, celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    client_price: Joi.number().required(),
    client_sale_price: Joi.number().optional(),
    wholesailer_price: Joi.number().required(),
    wholesailer_sale_price: Joi.number().optional(),
    on_sale_client: Joi.boolean().optional(),
    on_sale_wholesaler: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    description: Joi.string().required(),
    visible: Joi.boolean().optional(),
    stock_quantity: Joi.number().required(),
    image_id: Joi.string().optional(),
  })
}), ProductController.create);

routes.put('/updateProduct/:id', authenticateToken, isAdmin, celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().optional(),
    client_price: Joi.number().optional(),
    client_sale_price: Joi.number().optional(),
    wholesailer_price: Joi.number().optional(),
    wholesailer_sale_price: Joi.number().optional(),
    on_sale_client: Joi.boolean().optional(),
    on_sale_wholesaler: Joi.boolean().optional(),
    featured: Joi.boolean().optional(),
    description: Joi.string().optional(),
    visible: Joi.boolean().optional(),
    stock_quantity: Joi.number().optional(),
    image_id: Joi.string().optional(),
  })
}), ProductController.update);


//GoogleDrive
routes.get('/validateCredentials', DriveController.validateCredentials)

module.exports = routes;