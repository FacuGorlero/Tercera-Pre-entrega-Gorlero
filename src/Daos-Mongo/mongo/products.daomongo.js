// Importaciones
//const { ObjectId } = require('bson');
const { productModel } = require('./Models/products.model.js');  // Importa el modelo de productos

class ProductDaoMongo {
  constructor() {
    this.model = productModel;
  }

  getProducts = async (query, options) => await this.model.paginate(query, options);

  getProductsById = async (pid) => await this.model.findById({ _id: pid }).lean();

  addProduct = async (fields) => await this.model.create(fields);

  updateProduct = async (pid, changedProduct) => await this.model.findByIdAndUpdate(pid, changedProduct, {new: true});

  deleteProductById = async (pid) => await this.model.findByIdAndDelete(pid);

  deleteProductByCode = async (pcode) => await this.model.findOneAndDelete({code: pcode});

  getCategorys = async () => await this.model.distinct('category').sort();


  // get = async (query, options) => await this.model.paginate(query, options);

  // getById = async (pid) => await this.model.findById({ _id: pid }).lean();

  // add = async (fields) => await this.model.create(fields);

  // update = async (pid, changedProduct) => await this.model.findByIdAndUpdate(pid, changedProduct, {new: true});

  // deleteById = async (pid) => await this.model.findByIdAndDelete(pid);

  // deleteByCode = async (pcode) => await this.model.findOneAndDelete({code: pcode});

  // getCategorys = async () => await this.model.distinct('category').sort();

}

// Exportar la clase ProductDaoMongo
exports.ProductMongo = ProductDaoMongo;


