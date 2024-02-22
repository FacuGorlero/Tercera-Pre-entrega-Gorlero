// Importar el módulo Router de Express para gestionar rutas
const { Router } = require("express");

// Importar middleware para manejar respuestas y políticas de autenticación
const {handleResponses} = require("../middleware/handleresponses.js");
const { handleAuthFront } = require("../middleware/handlepolicies.js");
const ViewsController = require("../controller/views.controller.js");
const Control = new ViewsController();

// Crear una instancia de Router
const router = Router();

// Definir rutas y asignar controladores
// - La ruta "/" renderiza la página de inicio de sesión y requiere autenticación pública
router.get("/", handleAuthFront(['PUBLIC']), handleResponses, Control.login);

// - La ruta "/register" renderiza la página de registro y requiere autenticación pública
router.get("/register", handleAuthFront(['PUBLIC']), handleResponses, Control.register);

// - La ruta "/products" renderiza la página de productos y requiere autenticación pública
router.get("/products", handleAuthFront(['PUBLIC']), handleResponses, Control.products);

// - La ruta "/products/:pid" renderiza la página de un producto por su ID y requiere autenticación pública
router.get("/products/:pid", handleAuthFront(['PUBLIC']), handleResponses, Control.productById);

// - La ruta "/cart" renderiza la página del carrito y requiere autenticación de usuario o usuario premium
router.get("/cart", handleAuthFront(['USER', 'USER_PREMIUM']), handleResponses, Control.cart);

// - La ruta "/realTimeProducts" renderiza la página de productos en tiempo real y requiere autenticación de usuario premium
router.get("/realTimeProducts", handleAuthFront(['USER_PREMIUM']), handleResponses, Control.realTimeProducts);

// - La ruta "/chat" renderiza la página de chat y requiere autenticación de usuario o usuario premium
router.get("/chat", handleAuthFront(['USER', 'USER_PREMIUM']), handleResponses, Control.chat);

// - La ruta "/user" renderiza la página de usuario y requiere autenticación de usuario o usuario premium
router.get('/user', handleAuthFront(['USER', 'USER_PREMIUM']), handleResponses, Control.user);

// Exportar el router creado

exports.viewsrouter = router;