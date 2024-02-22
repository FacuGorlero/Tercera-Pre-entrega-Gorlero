import passport from "passport";

// Define la función passportCall que toma una estrategia Passport como argumento
const passportCall = (strategy) => {
    // Devuelve un middleware que se ejecutará en las solicitudes
    return async (req, res, next) => {
      // Llama a la función authenticate de Passport con la estrategia y opciones
      passport.authenticate(strategy, { session: false }, function (err, user, info) {
        // Maneja los errores si se producen durante la autenticación
        if (err) return next(err);
        
        // Si no hay un usuario, devuelve un error de autenticación
        if (!user) return res.status(401).send({ error: info.message ? info.message : info.toString() });
  
        // Si la autenticación es exitosa, establece el usuario en req.user y pasa al siguiente middleware
        req.user = user;
        next();
      })(req, res, next);
    };
  };
module.exports = {passportCall}