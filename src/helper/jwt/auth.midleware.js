const { CustomError } = require('../../utils/error');
const {renderPage} = require('../../helper/responses.js');


// AUTORIZACION TOKEN - SIN PASSPORT
// ------------------------------------------------------------------------------------
 const authenticationToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) resError(res, 401, "No authenticaded", "jwt-authToken")
  
  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_PRIVATE_KEY, (err, userDecode) => {
    if (err) resError(res, 401, "Unauthorized", "jwt-authToken")
    req.user = userDecode;
    next();
  });

  renderPage(res,"register","Nuevo Registro",{control: {answer: error.message }});
};
// TOKEN COOKIES
// ------------------------------------------------------------------------------------

authorization( ['USER', 'USER_PREMUIM'] )

// Define la función authorizationJwt que toma un array de roles como argumento
const authorizationJwt = (roleArray) => {
    // Devuelve un middleware que se ejecutará en las solicitudes
    return (req, res, next) => {
      try {
        // Verifica si hay un usuario autenticado en la solicitud
        if (!req.user) throw new CustomError('Unauthorized', 401);
  
        // Verifica si el rol del usuario está en el array de roles permitidos
        if (!roleArray.includes(req.user.role.toUpperCase())) {
          throw new CustomError('Not permissions', 403);
        }
  
        // Si todo está bien, pasa al siguiente middleware en la cadena
        next();
      } catch (error) {
        // Manejo de errores
        if (error instanceof CustomError) {
          // Si el error es una instancia de CustomError, renderiza una página de inicio con un mensaje de error
          renderPage(res, "login", "Inicio", { control: { answer: error.message } });
        } else {
          // Si es un error no identificado, renderiza una página de inicio con un mensaje genérico
          renderPage(res, "login", "Inicio", { control: { answer: 'Ocurrió un error, vuelva a intentarlo' } });
        }
      }
    };
  };
  
  // Exporta la función authorizationJwt como exportación predeterminada
  module.exports = {authorizationJwt, authenticationToken};