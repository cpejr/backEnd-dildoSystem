const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');
const userValidate = require('./validators/UserValidator');

const CategoryController = require('./controllers/CategoryController');
const categoryValidate = require('./validators/CategoryValidator')

const ProductController = require('./controllers/ProductController');
const productValidate = require('./validators/ProductValidator');

const SessionController = require('./controllers/SessionController');
const loginValidate = require('./validators/LoginValidator');

const DriveController = require('./controllers/DriveController');

const SubproductController = require('./controllers/SubproductController');
const subProductValidate = require('./validators/SubProductValidator');

const OrderController = require('./controllers/OrderController');
const orderValidate = require('./validators/OrderValidator');

const { authenticateToken, isAdmin, authenticateOptionalToken, isAdminOrSelf } = require('./middlewares/authentication');
const { celebrate, Segments, Joi } = require('celebrate');
const imageUpload = require('./middlewares/imageUpload');

//Users
routes.post('/user', celebrate(userValidate.create), UserController.create);
routes.get('/users', authenticateToken, isAdmin, celebrate(userValidate.index), UserController.index);
routes.get('/user/:id', authenticateToken, isAdmin, celebrate(userValidate.getOne), UserController.getOne);
routes.delete('/user/:id', authenticateToken, isAdminOrSelf, celebrate(userValidate.delete), UserController.delete);
routes.put('/user/:id', authenticateOptionalToken, isAdminOrSelf, celebrate(userValidate.update), UserController.update);
routes.post('/forgottenPassword', celebrate(userValidate.forgottenPassword), UserController.forgottenPassword);

//Session
routes.post('/login', celebrate(loginValidate.signin), SessionController.signin);
routes.get('/verify', celebrate(loginValidate.verifyToken), SessionController.verifyToken);

//Product
routes.post('/newProduct', authenticateToken, isAdmin, imageUpload('imageFile'), celebrate(productValidate.create), ProductController.create);
routes.get('/products', authenticateOptionalToken, celebrate(productValidate.index), ProductController.index);
routes.get('/product/:product_id', authenticateOptionalToken, celebrate(productValidate.getProduct), ProductController.getProduct);
routes.put('/updateProduct/:id', authenticateToken, isAdmin, imageUpload('imageFile', 'update'), celebrate(productValidate.update), ProductController.update);
routes.delete('/product/:product_id', authenticateToken, isAdmin, celebrate(productValidate.delete), ProductController.delete);
routes.get('/lowStock', authenticateToken, isAdmin, ProductController.getlowStock);

//Subproducts
routes.post('/newSubproduct', authenticateToken, isAdmin, imageUpload('imageFile'), celebrate(subProductValidate.create), SubproductController.create);
routes.get('/subproducts/:product_id', authenticateOptionalToken, celebrate(subProductValidate.getSubproducts), SubproductController.getSubproducts);
routes.delete('/subproducts/:product_id', authenticateToken, isAdmin, celebrate(subProductValidate.delete), SubproductController.delete);

//Orders
routes.post('/newOrder', authenticateToken, celebrate(orderValidate.create), OrderController.create);
routes.get('/orders', authenticateToken, isAdmin,celebrate(orderValidate.index), OrderController.index);
routes.put('/order/:id', authenticateToken, isAdmin, celebrate(orderValidate.update), OrderController.update);
routes.delete('/order/:order_id', authenticateToken, isAdmin, celebrate(orderValidate.delete), OrderController.delete);

//GoogleDrive
routes.get('/validateCredentials', DriveController.validateCredentials)

//Categories
routes.post('/newCategory', authenticateToken, isAdmin, celebrate(categoryValidate.createCategory), CategoryController.createCategory);
routes.post('/newSubcategory', authenticateToken, isAdmin, celebrate(categoryValidate.createSubcategory), CategoryController.createSubcategory);
routes.put('/category/:id', authenticateToken, isAdmin, celebrate(categoryValidate.updateCategory), CategoryController.updateCategory);
routes.put('/subcategory/:id', authenticateToken, isAdmin, celebrate(categoryValidate.updateSubcategory), CategoryController.updateSubcategory);
routes.delete('/category/:id', authenticateToken, isAdmin, celebrate(categoryValidate.deleteCategory), CategoryController.deleteCategory);
routes.delete('/subcategory/:id', authenticateToken, isAdmin, celebrate(categoryValidate.deleteSubcategory), CategoryController.deleteSubcategory);


module.exports = routes;
