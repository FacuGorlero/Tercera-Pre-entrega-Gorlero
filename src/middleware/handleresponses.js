const { configObject } = require('../config/index.js');
const {CustomError} = require('../utils/error.js');
const {development} = configObject

// Opciones para las cookies
const cookiesoptions = {
  maxAge: (1000 * 60 * 60 * 24),
  httpOnly: true,
  // secure: true,
  // sameSite: 'strict'
}

// Objeto de configuración para manejar errores de página
const pageError = {
  page: 'error',
  title: 'Error'
}

// Configuración adicional basada en el entorno de desarrollo
let additional = { development }

// Middleware para manejar respuestas
const handleResponses = (req, res, next) => {
  // Función para enviar respuestas con formato JSON
  const responses = (statusCode, isError = false, message = "", data = {}) => res.status(statusCode).json({ isError, message, data });

  // Métodos para enviar respuestas con diferentes códigos de estado
  res.sendSuccess = (data, message = "Success") => responses(200, false, message, data);
  res.sendCreated = (data, message = "Created") => responses(201, false, message, data);
  res.sendNoContent = (data, message = "No content") => responses(204, false, message, data);
  res.sendUserError = (message = "Bad Request", data) => responses(400, true, message, data);
  res.sendUserUnAuthorized = (message = "Unauthorized", data) => responses(401, true, message, data);
  res.sendUserForbidden = (message = "Forbidden", data) => responses(403, true, message, data);
  res.sendNotFound = (message = "Not Found", data) => responses(404, true, message, data);
  res.sendServerError = (message = "Internal Server Error", data) => responses(500, true, message, data);


  // Métodos adicionales para manejar cookies y casos especiales
  res.tokenCookie = (token) => res.cookie('token', token, cookiesoptions);
  res.sendSuccessOrNotFound = (variable, title) => variable ? res.sendSuccess(variable) : res.sendUserError(`${title} not found`);
  res.sendTokenCookieSuccess = (token, data) => res.tokenCookie(token).sendSuccess(data);
  res.sendCatchError = (error, message = "Internal Server Error") => (error instanceof CustomError) ? res.sendUserError(error.error, error) : res.sendServerError(message, error.toString());

  // Métodos para renderizar páginas con datos adicionales del usuario
  if (req.user) additional = { ...additional, ...req.user }

  res.renderPage = (page, title, configObject = {}) => res.render(page, { title, ...configObject, ...additional });
  res.renderPageEstruc = (page, title, options = {}, others = {}) => {
    const { control = {}, arrays = {}, pageControl = {} } = options;
    const renderObject = {
      title,
      ...control,
      ...arrays,
      ...pageControl,
      ...others,
      ...additional
    };
    res.render(page, renderObject);
  };
  res.renderError = (answer = "Ocurrio un error, vuelva a intentarlo", error) => res.renderPage(pageError.page, pageError.title, { answer: answer, answerDetail: error.toString(), ...additional });

  res.renderPageTokenCookie = (token, page, title, configObject = {}) => res.tokenCookie(token).renderPage(page, title, configObject);

  // Llama al siguiente middleware en la cadena
  next();
}

// Exporta el middleware handleResponses
module.exports = {handleResponses}
