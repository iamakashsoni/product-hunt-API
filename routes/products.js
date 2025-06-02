const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');

router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

router.post('/', verifyToken, productController.createProduct);
router.post('/:id/upvote', verifyToken, productController.toggleUpvote);

module.exports = router;
