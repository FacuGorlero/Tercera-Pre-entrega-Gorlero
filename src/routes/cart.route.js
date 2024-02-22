const { Router } =  require('express');
const {CartsController} = require('../controller/cart.controller')

const router = Router();
const Control = new CartsController();

router
  .get('/', Control.getCarts)
  .get('/:cid', Control.getCartById)
  .post('/', Control.create)
  .post('/:cid/product/:pid', Control.addProduct)
  .put('/:cid', Control.updateProducts) //+ body produc
  .delete('/:cid', Control.removeProducts) //+ body produc
  .put('/:cid/product/:pid', Control.updateProductQuantity) //+ body quantity
  .delete('/:cid/product/:pid', Control.removeProductById);

  exports.cartsRouter = router;