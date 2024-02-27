const {configObject} = require ('../config/index.js')

let UserDao
let ProductDao
let CartDao
let MessageDao
let ProductFile
let CartFile

console.log("Persistance Factory: ", configObject.persistence)
switch (configObject.persistence){
    case 'MONGO':
        const UserDaoMongo = require('./mongo/user.daomongo.js');
        UserDao = UserDaoMongo

        const ProductMongo = require('./mongo/products.daomongo.js');
        ProductDao =  ProductMongo

        const CartDaoMongo = require('./mongo/cart.daomongo.js')
        CartDao =  CartDaoMongo

        const MessageDaoMongo = require('./mongo/message.daomongo.js')
        MessageDao =  MessageDaoMongo
    break;

    case 'FILE':
        const ProductFileManager = require('./file/ProductManager.js')
        ProductFile = ProductFileManager

        const CartFileManager = require('./file/CartManager.js')
        CartFile = CartFileManager
    
        break;

        default:
            break;

}

console.log('====================================',UserDao)

module.exports = {
    UserDao,
    ProductDao,
    CartDao,
    MessageDao,
    ProductFile,
    CartFile

}