class CartRepository {
    constructor(dao) {
        this.dao = dao
    }
    getCarts = async() => await this.dao.get()
    create = async() => await this.dao.create()
    getCartsPopulate = async() => await this.dao.getCartsPopulate()
    getCartsById = async(cid) => await this.dao.getById(cid)
    getCartsByIdPopulate = async(cid) => await this.dao.getCartsByIdPopulate(cid)
    increaseProductQuantity = async(cid,pId) => await this.dao.increaseProductQuantity(cid,pId)
    decreaseProductQuantity = async(cid,pId) => await this.dao.decreaseProductQuantity(cid,pId)
    updateProductQuantity = async(cid,pId,quantity) => await this.dao.updateProductQuantity(cid,pId,quantity)
    removeProduct = async(cid,pId) => await this.dao.removeProduct(cid,pId)
    updateCartProducts = async(cid,newProducts) => await this.dao.updateCartProducts(cid,newProducts)
    removeCartProducts = async(cid) => await this.dao.removeCartProducts(cid)
}

module.exports = CartRepository