const { Router } = require('express');
const {ProductsController} = require('../controller/products.controller');

const router = Router();

const {getProducts, getProductsById, createProduct, updateProductById, deleteProductById, deleteProductByCode, getCategorys} = new ProductsController

router
  .get    ("/",     getProducts )       // + ? limit, page, sort, query
  .get    ("/:pid", getProductsById)
  .post   ("/",     createProduct)      // + body: whole product
  .put    ("/:pid", updateProductById)  // + body: whole product
  .delete ("/:pid", deleteProductById)
  .delete ("/",     deleteProductByCode)// products?code=x
  .get    ("/group/categorys", getCategorys )


exports.productsrouter = router;