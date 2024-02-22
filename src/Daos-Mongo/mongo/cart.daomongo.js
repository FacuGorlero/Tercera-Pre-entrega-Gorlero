const {CustomError} = require('../../utils/error.js')
const { cartModel } = require('./Models/carts.model.js');  // Importa el modelo de carrito
const { ProductMongo } = require('./products.daomongo.js');  // Importa la clase ProductMongo

const productsService = new ProductMongo();

class CartDaoMongo {
  constructor() {
    this.model = cartModel;
  }

  create = async () => await this.model.create({});

  get = async () => await this.model.find({});
  getCartsPopulate = async () => await this.model.find().populate('products.product');
  getById = async cid => await this.model.findById({ _id: cid });
  getCartsByIdPopulate = async cid => await this.model.findById({ _id: cid }).populate('products.product');

  async increaseProductQuantity(cid, pId) {
    const result = await this.model.updateOne(
      { _id: cid, "products.product": pId },
      { $inc: { "products.$.quantity": 1 } }
    );
    return await this.model.findById(cid);
  }
  decreaseProductQuantity = async (cid, pId) => {
    const result = await this.model.updateOne(
      { _id: cid, "products.product": pId },
      { $inc: { "products.$.quantity": -1 } }
    );
    return await this.model.findById(cid);
  }
  updateProductQuantity = async (cid, pId, quantity) => {
    const result = await this.model.updateOne(
      { _id: cid, "products.product": pId },
      { $set: { "products.$.quantity": quantity } }
    );
    return await this.model.findById(cid);
  }
  removeProduct = async (cid, pId) => {
    const result = await this.model.updateOne(
      { _id: cid },
      { $pull: { products: { product: pId }}}
    );
    return await this.model.findById(cid);

  }

  updateCartProducts = async (cid, newProducts) => {
    const result = await this.model.updateOne(
      { _id: cid },
      { $set: { products: newProducts } }
    );
    return await this.model.findById(cid);
  }
  removeCartProducts = async (cid) => {
    const result = await this.model.updateOne(
      { _id: cid },
      { $set: { products: [] } }
    );
    return await this.model.findById(cid);
  }
}
exports.CartMongo = CartDaoMongo;
