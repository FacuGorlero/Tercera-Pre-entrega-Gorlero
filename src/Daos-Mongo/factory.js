const {configObject} = require ('../config/index.js')

let UserDao
let ProductDao
let CartDao
let MessageDao

console.log("Persistance Factory: ", configObject.persistence)
switch (configObject.persistence){
    case 'MONGO':
        const UserDaoMongo = require('./mongo/user.daomongo.js');
        UserDao = UserDaoMongo

        const ProductDaoMongo = require('./mongo/product.daomongo.js');
        ProductDao =  ProductDaoMongo

        const CartDaoMongo = require('./mongo/cart.daomongo.js')
        CartDao =  CartDaoMongo

        const MessageDaoMongo = require('./mongo/message.daomongo.js')
        MessageDao =  MessageDaoMongo
    break;

    case 'FILE':
        const ProductFileManager = require('./file/ProductManager.js')
        ProductDao = ProductFileManager

        const CartFileManager = require('./file/CartManager.js')
        CartDao = CartFileManager
    
        break;

        default:
            break;

}

console.log('====================================',UserDao)

module.exports = {
    UserDao,
    ProductDao,
    CartDao,
    MessageDao
}