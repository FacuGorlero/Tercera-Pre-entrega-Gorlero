class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }
    getProducts = async(query, options) => await this.dao.get(query, options)
    getProductsById = async(pid) => await this.dao.getById(pid)
    addProduct = async(fields) => await this.dao.add(fields)
    updateProduct = async(pid, changedProduct) => await this.dao.update(pid, changedProduct)
    deleteProductById = async(pid ) => await this.dao.deleteById(pid)
    deleteProductByCode = async(pcode ) => await this.dao.deleteByCode(pcode)
    getCategorys = async () => await this.model.getCategorys('category').sort();
}

module.exports = ProductRepository