// Importar la clase UserClass del módulo dao/index.js
const { UserMongo } = require("../Daos-Mongo/mongo/user.daomongo");

// Definir la clase UsersController
class UsersController {
  // Constructor que inicializa el servicio con una instancia de UserClass
  constructor() {
    this.service = new UserMongo();
  }

  // Método para obtener datos de usuario por ID
  getDataUserById = async id => {
    // Obtener información del usuario utilizando el servicio
    const user = await this.service.getUserById(id);

    // Retornar un objeto con información del usuario y acceso adicional
    return {
      userId: id,
      userName: user?.first_name,
      userLName: user?.last_name,
      userEmail: user?.email,
      userRole: user?.role,
      userCart: user?.cart,
      ...this.handleAccess(user?.role) // Agregar acceso adicional basado en el rol del usuario
    };
  } // Este método no es un controlador de ROUTER, es una función auxiliar

  // Función auxiliar para manejar el acceso basado en el rol del usuario
  handleAccess = role => {
    const access = {};

    // Agregar acceso premium si el rol es 'user_premium'
    if (role === 'user_premium') access.accessPremium = true;

    return access;
  }
}

// Exportar la clase UsersController
module.exports = UsersController;
