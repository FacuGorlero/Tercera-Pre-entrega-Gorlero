

// Define las opciones de las cookies
const cookiesoptions = {
    httpOnly: true,
    //secure: true,
    //sameSite:'strict'
  };
  
  // Enviar una respuesta JSON estándar
  const resJson = (res, statusCode, data, token = null) => {
    res.status(statusCode).json({
      error: false,
      data,
      token
    });
  };
  
  // Enviar una respuesta JSON con una cookie adjunta
  const resCookieJson = (res, statusCode, data, token, maxAge = (1000 * 60 * 60 * 24)) => {
    res.cookie('token', token, {
      maxAge,
      ...cookiesoptions
    }).status(statusCode).json({
      error: false,
      data,
      token: "ver: " + token
    });
  };
  
  // Enviar una respuesta de error JSON
  const resError = (res, statusCode, message, context = '', error = true) => {
    statusCode = Number.parseInt(statusCode);
    statusCode = Number.isNaN ? 500 : statusCode;
    res.status(statusCode).json({
      error,
      message,
      context
    });
  };
  
  // Manejar errores y enviar una respuesta de error JSON
  const resCatchError = (res, error) => {
    //, statusCode, message, context=''
    let { statusCode } = error;
    statusCode = Number.parseInt(statusCode);
    statusCode = Number.isNaN ? 500 : statusCode;
    res.status(error.statusCode || 500).json({
      error: true,
      message: error.message,
      context: error.context || ''
    });
  };
  
  // Renderizar una página
  const renderPage = (res, page, title, options = {}, others = {}) => {
    const { user = {}, control = {}, arrays = {}, pageControl = {} } = options;
    res.render(page, {
      title,
      ...user,
      ...control,
      ...arrays,
      ...pageControl,
      ...others
    });
  };
  
  // Renderizar una página (versión alternativa)
  const renderPageC = (res, page, title, options = {}, others = {}) => {
    const { user = {}, control = {}, arrays = {}, pageControl = {} } = options;
    res.render(page, {
      title,
      ...user,
      ...control,
      ...arrays,
      ...pageControl,
      ...others
    });
  };
  
  // Exportar todas las funciones y variables necesarias
  module.exports = {
    cookiesoptions,
    resJson,
    resCookieJson,
    resError,
    resCatchError,
    renderPage,
    renderPageC
  };
  