const {configObject} = require("../config/index.js");
const {userService}  = require("../repositories/services.js");
const {createToken} = require("../utils/jwt.js");
const {CustomError} = require("../utils/error.js");
const { createHash, isValidPassword } = require("../utils/hashPassword.js");
const {validateFields} = require("../utils//validatefields.js");

const usersService = userService;

class SessionsController {
  constructor() {
    this.service = ""; // No se utiliza, puede eliminarse
  }

  // Definición de campos requeridos para el registro y login
  requiredFields = {
    register: ['first_name', 'last_name', 'email', 'birthday', 'password'],
    login: ['email', 'password']
  };

  // Lista de administradores y su contraseña
  admins = configObject.uadmins || [];
  admin_pass = configObject.uadmin_pass;

  // Método para el registro de usuarios
  register = async (req, res) => {
    try {
      // Validar campos requeridos y hashear la contraseña
      const userData = validateFields(req.body, this.requiredFields.register);
      userData.password = createHash(userData.password);

      // Verificar si ya existe un usuario con el mismo email
      const userFound = await usersService.getUserByMail(userData.email);
      if (userFound) throw new CustomError(`Ya existe un usuario con ese email. Pruebe con otro`);

      // Crear usuario y renderizar página de login con mensaje de éxito
      await usersService.createUser(userData);
      res.renderPage("login", "Login", { answer: 'Se ha registrado Correctamente' });

    } catch (error) {
      // Manejar errores y renderizar página de registro con mensaje de error
      if (error instanceof CustomError) {
        res.renderPage("register", "Nuevo Registro", { answer: error.message });
      } else {
        res.renderPage("register", "Nuevo Registro", { answer: 'Ocurrió un error, vuelva a intentarlo' });
        console.log(error.message);
      }
    }
  };  // Respuesta Visual

  // Método para el login de usuarios
  login = async (req, res) => {
    const userData = validateFields(req.body, this.requiredFields.login);

    try {
      // Verificar si es un administrador y autenticar con contraseña de administrador
      if (this.admins.includes(userData.email) && isValidPassword(userData.password, { password: this.admin_pass })) {
        const token = createToken({ id: 0, role: "Admin" });
        return res.sendTokenCookieSuccess(token, "Log In exitoso con Usuario Administrador");
      }

      // Verificar si el usuario existe y la contraseña es válida
      const userFound = await usersService.getUserByMail(userData.email);
      if (!userFound || !isValidPassword(userData.password, userFound)) {
        throw new CustomError(`Email o contraseña equivocado`);
      }

      // Crear token y enviar respuesta exitosa con el token
      const token = createToken({ id: userFound._id, role: userFound.role });
      res.sendTokenCookieSuccess(token, "Log In exitoso con Id: "+userFound.first_name);

    } catch (error) {
      // Manejar errores y enviar respuesta de error
      res.sendCatchError(error);
    }
  };

  // Método para iniciar sesión usando la sesión de Express
  loginSession = async (req, res) => {
    const userData = validateFields(req.body, this.requiredFields.login);

    try {
      // Verificar si es un administrador y autenticar con contraseña de administrador
      if (userData.email == configObject.uadmin && isValidPassword(userData.password, { password: configObject.uadmin_pass })) {
        req.session.user = {
          first_name: "Admin",
          email: userData.email,
          role: "Admin"
        };
        return res.redirect('/products');
      }

      // Verificar si el usuario existe y la contraseña es válida
      const userFound = await usersService.getUserByMail(userData.email);
      if (!userFound || !userFound._id || isValidPassword(createHash(userData.password), userFound)) {

        throw new CustomError(`Email o contraseña equivocado`);
      }

      // Almacenar datos del usuario en la sesión y redirigir a la página de productos
      req.session.user = {
        user: userFound._id,
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        email: userFound.email,
        role: userFound.role,
      };

      res.redirect('/products');

    } catch (error) {
      // Manejar errores y enviar respuesta de error
      if (error instanceof CustomError) {
        res.sendUserError(error);
      } else {
        res.sendServerError(error);
      }
    }
  };

  // Método para cerrar sesión
  logout = (req, res) => {
    if (req.user) {
      res.clearCookie('token').redirect('/');
    } else {
      res.redirect('/');
    }
  };

  // Método para manejar la autenticación con GitHub (por implementar)
  github = async (req, res) => {};

  // Método de retorno para la autenticación de GitHub (por implementar)
  githubcallback = (req, res) => {
    const token = createToken({ id: req.user._id, role: req.user.role });
    res.tokenCookie(token).redirect('/products');
  };

  // Método de prueba para obtener datos sensibles del usuario actual
  pruebasCurrent = (req, res) => {
    try {
      const datosP = { message: "Datos sensibles", reqUser: req.user };
      res.renderPage('current', 'PRUEBA', { contenido: JSON.stringify(datosP) });
    } catch (error) {
      // Renderizar página de error en caso de problemas
      return res.renderError(error.error);
    }
  };
}

// Exportar la clase SessionsController
module.exports = SessionsController;
