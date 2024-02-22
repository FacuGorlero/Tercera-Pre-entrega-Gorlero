
const {configObject} = require("../config/index.js");
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const {handleResponses} = require("../middleware/handleresponses");

const JWT_PRIVATE_KEY = configObject.jwt_code;

class CustomRouter {
  constructor() {
    this.router = Router(); // Crea una instancia de un router de Express
    this.init(); // Llama al método init, que se puede personalizar en las clases que extienden CustomRouter
  }

  init() {
    // Este método se deja vacío y se puede personalizar en las clases que extienden CustomRouter
  }

  getRouter() {
    return this.router; // Devuelve el router de Express configurado con las rutas y políticas de acceso
  }

  // Métodos para definir rutas con distintos verbos HTTP

  get(path, policies, ...callbacksA) {
    this.router.get(path, handleResponses, this.handlePolicies(policies), this.applyCallbacks(callbacksA));
  }

  post(path, policies, ...callbacksA) {
    this.router.post(path, handleResponses, this.handlePolicies(policies), this.applyCallbacks(callbacksA));
  }

  put(path, policies, ...callbacksA) {
    this.router.put(path, handleResponses, this.handlePolicies(policies), this.applyCallbacks(callbacksA));
  }

  delete(path, policies, ...callbacksA) {
    this.router.delete(path, handleResponses, this.handlePolicies(policies), this.applyCallbacks(callbacksA));
  }

  // Método para manejar las políticas de acceso
  // Policies => ['PUBLIC', 'USER', 'USER_PREMIUM', 'ADMIN']
  handlePolicies = (policies) => (req, res, next) => {
    try {
      if (policies[0] === 'PUBLIC') return next(); // Si la política es 'PUBLIC', se permite el acceso sin autenticación
      const authHeaders = req.headers.authorization;
      if (!authHeaders) return res.status(401).send({ isError: true, data: 'Unauthorized' });

      const token = authHeaders.split(" ")[1];
      const user = jwt.verify(token, JWT_PRIVATE_KEY);

      if (!policies.includes(user.role.toUpperCase())) {
        return res.status(403).send({ isError: true, data: 'Not permissions' });
      }

      req.user = user; // Agrega la información del usuario autenticado al objeto de solicitud
      next();
    } catch (error) {
      return res.status(401).send({ isError: true, data: 'Token Invalid' });
    }
  };

  // Método para ejecutar callbacks (middlewares y controladores) asociados a las rutas
  applyCallbacks(callbacksArray) {
    // Parámetros: req, res, next
    return callbacksArray.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        params[1].status(500).send(error);
      }
    });
  }
}

module.exports = CustomRouter;
