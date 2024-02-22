// Importar configuraciones y módulos necesarios
const {configObject} = require("../config/index.js");
const { ProductMongo } = require("../Daos-Mongo/mongo/products.daomongo.js");
const {CustomError} = require("../utils/error.js");

// Crear una instancia de ProductClass para interactuar con productos
const productsService = new ProductMongo();

// Definir la clase ViewsController
class ViewsController {
  // Constructor vacío
  constructor() {}

  // Método para renderizar la página de inicio de sesión
  login = (req, res) => {
    try {
      // Redirigir a /products si el usuario ya está autenticado
      if (req.user) return res.redirect('/products');
      
      // Renderizar la página de inicio de sesión
      res.renderPage("login", "Login");
    } catch (error) {
      res.renderError(error);
    }
  }

  // Método para renderizar la página de registro
  register = (req, res) => {
    try {
      // Redirigir a /products si el usuario ya está autenticado
      if (req.user) return res.redirect('/products');
      
      // Renderizar la página de registro
      res.renderPage("register", "Nuevo Registro");
    } catch (error) {
      res.renderError(error);
    }
  }

  // Método para renderizar la página de productos
  products = async (req, res) => {
    try {
      // Manejar parámetros de la URL para la API de productos
      const {
        page = 1,
        sort,
        category: initialCategory,
        availability = true,
      } = req.query;
      const category = initialCategory === "all" ? null : initialCategory;
      const apiUrl = new URL(`http://localhost:${configObject.port}/api/products`);
      apiUrl.searchParams.set("page", page);
      apiUrl.searchParams.set("limit", "5");
      if (sort) apiUrl.searchParams.set("sort", sort);
      if (category) apiUrl.searchParams.set("category", category);
      if (availability) apiUrl.searchParams.set("availability", availability);

      // Realizar solicitud a la API de productos y obtener datos
      const data = await (await fetch(apiUrl)).json();

      // Manejar errores y páginas inválidas
      if (
        data.error ||
        Number(page) > Number(data.data.totalPages) ||
        Number(page) < 0
      ) {
        return res.renderPage("products", "Productos", { productError: true });
      }

      // Actualizar datos del producto para la presentación en la página
      const product = data.data.docs.map((prd) => ({
        ...prd,
        price: prd.price.toLocaleString("es-ES", { style: "decimal" }),
        unavailability: prd.stock === 0,
        link: `/products/${prd._id}`,
      }));

      // Función para generar URL filtradas
      const filterUrl = (filter) => {
        const params = new URLSearchParams(req.url.split("?")[1] || "");
        params.delete(filter);
        params.delete("page");
        return `/products?${params}`;
      };

      // Renderizar la página de productos con datos y controles de paginación
      res.renderPageEstruc("products", "Productos", {
        control: {
          productError: false,
        },
        arrays: {
          product,
          category: await productsService.getCategorys(),
        },
        pageControl: {
          page: data.data.page,
          totalPages: data.data.totalPages,
          hasPrevPage: data.data.hasPrevPage,
          hasNextPage: data.data.hasNextPage,
          prevLink: filterUrl("page") + data.data.prevLink,
          nextLink: filterUrl("page") + data.data.nextLink,
          ascend: filterUrl("sort") + "&sort=asc",
          descend: filterUrl("sort") + "&sort=desc",
          disorderly: filterUrl("sort") + "&sort=disorderly",
          availability: filterUrl("availability") + "&availability=false",
          unavailability: filterUrl("availability") + "&availability=true",
          url: filterUrl("category"),
        },
      });
    } catch (error) {
      res.renderError(error);
    }
  }

  // Método para renderizar la página de un producto por su ID
  productById = async (req, res) => {
    try {
      const { pid } = req.params;
      const apiUrl = `http://localhost:${configObject.port}/api/products/${pid}`;

      // Realizar solicitud a la API de productos por ID
      const resp = await (await fetch(apiUrl)).json();
      const { isError, data } = resp;

      // Renderizar la página del producto con datos y controles
      res.renderPageEstruc("product", "Producto", {
        control: {
          productError: isError,
        },
        arrays: {
          product: data,
        },
      });

    } catch (error) {
      res.renderError(error);
    }
  }

  // Método para renderizar la página del carrito de compras
  cart = async (req, res) => {
    try {
      // Obtener el ID del carrito del usuario
      const cart = req.user.userCart;

      // Realizar solicitud a la API de carritos para obtener productos en el carrito
      let resp = await fetch(`http://localhost:${configObject.port}/api/carts/${cart}`);
      const products = (await resp.json()).data.products;

      // Calcular el total para cada producto en el carrito
      products.forEach(product => product.total = product.product.price * product.quantity);

      // Configurar objeto para la presentación en la página
      const objectRender = {
        cartError: false,
        cartId: cart,
        cartNoEmpty: products.length !== 0,
        products: products.length !== 0 ? products : undefined
      };

      // Renderizar la página del carrito con datos y controles
      res.renderPage('cart', 'Carrito', objectRender);
    } catch (error) {
      // Manejar errores al cargar el carrito
      res.renderError('Hubo un problema al cargar el carrito', error);
    }
  };

  // Método para renderizar la página de productos en tiempo real
  realTimeProducts = async (req, res) => {
    try {
      // Realizar solicitud a la API de productos para obtener productos en tiempo real
      const apiUrl = `http://localhost:${configObject.port}/api/products?limit=100`;
      const resp = (await (await fetch(apiUrl)).json()).data.docs;

      // Configurar datos del producto para la presentación en la página
      const product = resp.map((prd) => ({
        ...prd,
        price: prd.price.toLocaleString('es-ES', { style: 'decimal' }),
      }));

      // Renderizar la página de productos en tiempo real con datos y estilos adicionales
      res.renderPageEstruc('realTimeProducts', 'Productos en tiempo Real', {}, {
        product,
        cssPlus: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css`,
      });
    } catch (error) {
      // Manejar errores al cargar los productos en tiempo real
      res.renderError('Hubo un problema al cargar los productos', error);
    }
  }

  // Método para renderizar la página de chat
  chat = async (req, res) => res.renderPage('chat', 'Chat');

  // Método para renderizar la página de usuario
  user = async (req, res) => {
    try {
      // Renderizar la página de usuario con estructura adecuada
      res.renderPageEstruc('user', 'Usuario');
    } catch (error) {
      // Manejar errores al renderizar la página de usuario
      res.renderError(error);
    }
  }
}

// Exportar la clase ViewsController
module.exports = ViewsController;
