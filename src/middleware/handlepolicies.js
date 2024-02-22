// Requiere el módulo 'passport' y el DAO (Objeto de Acceso a Datos) para usuarios en MongoDB
const passport = require("passport");
const UsersController  = require('../controller/users.controller');

// Crea una instancia del DAO para usuarios en MongoDB
const Control = new UsersController();

// Middleware para la autenticación de usuarios desde el frontend
const handleAuthFront = (policies) => {
  return async (req, res, next) => {
    try {
      // Autentica al usuario usando el método 'jwt' de Passport
      passport.authenticate('jwt', { session: false }, async function (err, user, info) {
        if (err) next(err);

        // Si hay un usuario autenticado
        if (user) {
          // Obtiene los datos del usuario desde el controlador del DAO
          req.user = await Control.getDataUserById(user.id);
        }

        // Si la política de acceso es pública, continúa al siguiente middleware
        if (policies[0] === 'PUBLIC') return next();

        // Si no hay usuario autenticado, redirige al login
        if (!user) return res.clearCookie('token').render("login", { title: "Login", answer: 'Usuario no logueado' });

        // Si el usuario es un administrador, continúa al siguiente middleware
        if (user.role.toUpperCase() === 'ADMIN') return next();

        // Si el rol del usuario no está autorizado según la política, muestra un error
        if (!policies.includes(user.role.toUpperCase())) return res.render('error', { title: 'Ha ocurrido un error', answer: 'User not authorized', ...req.user });

        // Si pasa todas las validaciones anteriores, continúa al siguiente middleware
        next();
      })(req, res, next);
    } catch (error) {
      // Maneja cualquier error que ocurra durante el proceso
      next(error);
    }
  };
};

// Middleware para la autenticación de usuarios
const handleAuth = async (policies) => {
  return async (req, res, next) => {
    try {
      // Autentica al usuario usando el método 'jwt' de Passport
      passport.authenticate('jwt', { session: false }, async function (err, user, info) {
        if (err) next(err);

        // Si hay un usuario autenticado
        if (user) {
          // Obtiene los datos del usuario desde el controlador del DAO
          req.user = await Control.getDataUserById(user.id);
        }

        // Si la política de acceso es pública, continúa al siguiente middleware
        if (policies[0] === 'PUBLIC') return next();

        // Si no hay usuario autenticado, muestra un error
        if (!user) return res.sendUserError('Invalid token');

        // Si el usuario es un administrador, continúa al siguiente middleware
        if (user.role.toUpperCase() === 'ADMIN') return next();

        // Si el rol del usuario no está autorizado según la política, muestra un error
        if (!policies.includes(user.role.toUpperCase())) return res.sendUserError('User not authorized');

        // Si pasa todas las validaciones anteriores, continúa al siguiente middleware
        next();
      })(req, res, next);
    } catch (error) {
      // Maneja cualquier error que ocurra durante el proceso
      next(error);
    }
  };
};

// Exporta las funciones de middleware
module.exports = { handleAuthFront, handleAuth };
