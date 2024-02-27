const {cartService} = require ('../repositories/services')
const {productService} = require ('../repositories/services') 

const productsService = productService

class CartsController {
    // Constructor: inicializa el controlador con una instancia de CartClass
    constructor() {
      this.service = cartService;
    }
  
    // Método para obtener todos los carritos
    getCarts = async (req, res) => {
      try {
        // Obtiene el valor de la consulta "populate" o establece "true" por defecto
        const populate = req.query.populate || true;
  
        let carts;
        // Utiliza el método getCartsPopulate si populate es true, de lo contrario, usa getCarts
        if (populate) {
          carts = await this.service.getCartsPopulate();
        } else {
          carts = await this.service.getCarts();
        }
  
        // Envía una respuesta exitosa con la lista de carritos o maneja errores
        res.sendSuccess(carts);
      } catch (error) {
        res.sendCatchError(error);
      }
    }
  
    // Método para obtener un carrito por su ID
    getCartById = async (req, res) => {
      try {
        // Obtiene el ID del carrito y el valor de la consulta "populate" o establece "true" por defecto
        const cid = req.params.cid;
        const populate = req.query.populate || true;
  
        let carts;
        // Utiliza el método getCartsByIdPopulate si populate es true, de lo contrario, usa getCartsById
        if (populate) {
          carts = await this.service.getCartsByIdPopulate(cid);
        } else {
          carts = await this.service.getCartsById(cid);
        }
  
        // Envía una respuesta exitosa con el carrito encontrado o maneja errores
        res.sendSuccess(carts);
      } catch (error) {
        res.sendCatchError(error);
      }
    }
  
    // Método para crear un nuevo carrito
    create = async (req, res) => {
      try {
        // Llama al método create de la instancia de CartClass
        const resp = await this.service.create();
        // Envía una respuesta exitosa con la respuesta del método create
        res.sendSuccess(resp);
      } catch (err) {
        // Maneja errores
        res.sendCatchError(err);
      }
    }
  
    // Método para agregar un producto al carrito
    addProduct = async (req, res) => {
      try {
        // Obtiene los parámetros de la solicitud que contienen los IDs del carrito y del producto
        const { cid, pid } = req.params;
  
        // Obtiene el carrito y el producto utilizando los IDs
        const cart = await this.service.getCartsById(cid);
        if (!cart) return res.sendNotFound('Carrito no encontrado');
        const product = await productsService.getProductsById(pid);
        if (!product) return res.sendNotFound('Producto no encontrado');
  
        // Incrementa la cantidad del producto en el carrito
        const updatedCart = await this.service.increaseProductQuantity(cid, pid);
  
        // Envía una respuesta exitosa con el carrito actualizado
        res.sendSuccess(updatedCart);
      } catch (error) {
        // Maneja errores
        res.sendCatchError(error);
      }
    }
  
    // Otros métodos siguen el mismo patrón: manejan solicitudes relacionadas con carritos y productos
    // ...
    decreaseProductQuantityById = async (req, res) => {
      try {
        const { cid, pid } = req.params;
    
        const cart = await this.service.getCartsById(cid);
        if (!cart) return res.sendNotFound('Carrito no encontrado');
    
        const product = await products.getProductsById(pid);
        if (!product) return res.sendNotFound('Producto no encontrado');
    
        const updatedCart = await this.service.decreaseProductQuantity(cid, pid);
  
        res.sendSuccess(updatedCart)
      } catch (error) {
        res.sendCatchError(error)
      }
    }
    // Actualiza la cantidad de un producto en el carrito
    updateProductQuantity = async (req, res) => {
      try {
        const { cid, pid } = req.params;
        const { quantity } = req.body * 1;
  
        // Verifica que la cantidad sea un número válido
        if (isNaN(quantity)) res.sendUserError("Se ha introducido mal la cantidad");
  
        // Obtiene el carrito y el producto utilizando los IDs
        const cart = await this.service.getCartsById(cid);
        if (!cart) return res.sendNotFound('Carrito no encontrado');
        const product = await productsService.getProductsById(pid);
        if (!product) return res.sendNotFound('Producto no encontrado');
  
        // Actualiza la cantidad del producto en el carrito
        const updatedCart = await this.service.updateProductQuantity(cid, pid, quantity);
  
        // Envía una respuesta exitosa con el carrito actualizado
        res.sendSuccess(updatedCart);
      } catch (error) {
        // Maneja errores
        res.sendCatchError(error);
      }
    }
  
    // Elimina un producto del carrito
    removeProductById = async (req, res) => {
      try {
        const { cid, pid } = req.params;
  
        // Obtiene el carrito y el producto utilizando los IDs
        const cart = await this.service.getCartsById(cid);
        if (!cart) return res.sendNotFound('Carrito no encontrado');
        const product = await productsService.getProductsById(pid);
        if (!product) return res.sendNotFound('Producto no encontrado');
  
        // Elimina el producto del carrito
        const updatedCart = await this.service.removeProduct(cid, pid);
  
        // Envía una respuesta exitosa con el carrito actualizado
        res.sendSuccess(updatedCart);
      } catch (error) {
        // Maneja errores
        res.sendCatchError(error);
      }
    }
   
    // Actualiza los productos en el carrito
    updateProducts = async (req, res) => {
      try {
        const { cid } = req.params;
        const newProducts = req.body;
  
        // Obtiene el carrito utilizando el ID
        const cart = await this.service.getCartsById(cid);
        if (!cart) return res.sendNotFound('Carrito no encontrado');
  
        // Actualiza los productos en el carrito
        const updatedCart = await this.service.updateCartProducts(cid, newProducts);
  
        // Envía una respuesta exitosa con el carrito actualizado
        res.sendSuccess(updatedCart);
      } catch (error) {
        // Maneja errores
        res.sendCatchError(error);
      }
    }
  
    // Elimina todos los productos del carrito
    removeProducts = async (req, res) => {
      try {
        const { cid } = req.params;
  
        // Obtiene el carrito utilizando el ID
        const cart = await this.service.getCartsById(cid);
        if (!cart) return res.sendNotFound('Carrito no encontrado');
  
        // Elimina todos los productos del carrito
        const updatedCart = await this.service.removeCartProducts(cid);
  
        // Envía una respuesta exitosa con el carrito actualizado
        res.sendSuccess(updatedCart);
      } catch (error) {
        // Maneja errores
        res.sendCatchError(error);
      }
    }
  }
  
  // Exporta la clase CartsController
module.exports = {CartsController};
  
