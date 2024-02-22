const { ProductMongo} = require('../Daos-Mongo/mongo/products.daomongo');
const {convertSort, convertAvailability, checkCategory } = require('../helper/mongohelpers');
const {validateFields} = require('../utils/validatefields');


class ProductsController {
  constructor() {
    // Inicializa el controlador con una instancia del servicio ProductClass
    this.service = new ProductMongo();
  }

  // Obtiene una lista de productos según los parámetros de consulta proporcionados
  getProducts = async (req, res) => {
    try {
      // Desestructura los parámetros de la consulta de la solicitud
      let {
        limit = 10,
        page = 1,
        category,
        availability,
        sort,
        campo1,
        filtro1,
        campo2,
        filtro2,
        campo3,
        filtro3,
      } = req.query;

      // Construye el objeto de consulta para filtrar productos
      const query = {
        ...(await checkCategory(category) && { category: category }),
        ...convertAvailability(availability),
      };

      // Construye las opciones de paginación y ordenamiento
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: convertSort(sort, "price"),
      };

      // Agrega filtros adicionales al objeto de consulta si se proporcionan
      if (campo1 && filtro1) query[campo1] = filtro1;
      if (campo2 && filtro2) query[campo2] = filtro2;
      if (campo3 && filtro3) query[campo3] = filtro3;

      // Obtiene la lista de productos según los parámetros
      const resp = await this.service.getProducts(query, options);

      // Calcula los enlaces de paginación previa y siguiente
      const { prevPage, nextPage } = resp;
      const prevLink = prevPage ? `&page=${prevPage}` : "";
      const nextLink = nextPage ? `&page=${nextPage}` : "";

      // Envía la respuesta exitosa junto con enlaces de paginación
      res.sendSuccess({
        ...resp,
        prevLink: prevLink,
        nextLink: nextLink,
      });
    } catch (error) {
      // En caso de error, envía un error al cliente
      res.sendCatchError(error, "An error occurred in the API request");
    }
  };

  // Obtiene un producto por su ID
  getProductsById = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await this.service.getProductsById(pid);
      // Envía el producto si se encuentra, de lo contrario, envía un error not found
      res.sendSuccessOrNotFound(product, "Id");
    } catch (error) {
      // En caso de error, envía un error al cliente
      res.sendCatchError(error);
    }
  };

  // Crea un nuevo producto
  createProduct = async (req, res) => {
    // Obtiene los campos del cuerpo de la solicitud
    const fields = req.body;

    // Define los campos requeridos para la creación de un nuevo producto
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "status",
      "category",
      "thumbnail",
    ];

    try {
      // Valida que se proporcionen todos los campos requeridos
      const newProduct = validateFields(fields, requiredFields);

      // Agrega el nuevo producto a la base de datos
      const product = await this.service.addProduct(newProduct);

      // Envía la respuesta exitosa con el nuevo producto
      res.sendSuccess(product);
    } catch (error) {
      // En caso de error, envía un error al cliente
      res.sendCatchError(error);
    }
  };

  // Actualiza un producto por su ID
  updateProductById = async (req, res) => {
    try {
      const pid = req.params.pid;
      const changedProduct = req.body;

      // Actualiza el producto en la base de datos y obtiene el resultado
      const product = await this.service.updateProduct(pid, changedProduct);

      // Envía el producto actualizado si se encuentra, de lo contrario, envía un error not found
      res.sendSuccessOrNotFound(product, "Id");
    } catch (error) {
      // En caso de error, envía un error al cliente
      res.sendCatchError(error);
    }
  };

  // Elimina un producto por su ID
  deleteProductById = async (req, res) => {
    try {
      const pid = req.params.pid;

      // Elimina el producto de la base de datos y obtiene el resultado
      const product = await this.service.deleteProductById(pid);

      // Envía el producto eliminado si se encuentra, de lo contrario, envía un error not found
      res.sendSuccessOrNotFound(product, "Id");
    } catch (error) {
      // En caso de error, envía un error al cliente
      res.sendCatchError(error);
    }
  };

  // Elimina un producto por su código
  deleteProductByCode = async (req, res) => {
    try {
      const pcode = req.query.code;

      // Elimina el producto de la base de datos por código y obtiene el resultado
      const product = await this.service.deleteProductByCode(pcode);

      // Envía el producto eliminado si se encuentra, de lo contrario, envía un error not found
      res.sendSuccessOrNotFound(product, "Code");
    } catch (error) {
      // En caso de error, envía un error al cliente
      res.sendCatchError(error);
    }
  };

  // Obtiene la lista de categorías de productos
  getCategorys = async (req, res) => {
    try {
      // Obtiene la lista de categorías disponibles en la base de datos
      const categorys = await this.service.getCategorys();

      // Envía la lista de categorías si se encuentra, de lo contrario, envía un error not found
      res.sendSuccessOrNotFound(categorys, "Categorys");
    } catch (error) {
      // En caso de error, envía un error al cliente
      res.sendCatchError(error);
    }
  };
}

// Exporta la clase ProductsController
module.exports = {ProductsController};
