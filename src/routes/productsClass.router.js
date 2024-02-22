const Router = require("./routerClass");

// Definición de la clase UsersCRouter que extiende de Router
class UsersCRouter extends Router {
  // Método de inicialización de rutas
  init() {
    // Definición de la ruta GET para obtener usuarios, requiere autenticación de tipo 'USER' o 'ADMIN'
    this.get('/', ['USER', 'ADMIN'], async (req, res) => {
      try {
        // Simulación de la obtención de usuarios desde la base de datos
        const users = "users"; // userModel.find()
        
        // Verificar si se encontraron usuarios
        if (!users) {
          return res.sendUserError("User not found");
        }
        
        // Enviar respuesta exitosa con los usuarios
        res.sendSuccess(users);
      } catch (error) {
        // Enviar respuesta de error interno del servidor
        res.sendServerError(error);
      }
    });

    // Definición de la ruta POST para crear usuarios
    this.post('/', (req, res) => {
      res.send("POST USERS: Prueba exitosa");
    });

    // Definición de la ruta PUT para actualizar usuarios
    this.put('/', (req, res) => {
      res.send("PUT USERS: Prueba exitosa");
    });

    // Definición de la ruta DELETE para eliminar usuarios
    this.delete('/', (req, res) => {
      res.send("DELETE USERS: Prueba exitosa");
    });
  }
}

// Exportar la clase UsersCRouter
module.exports = UsersCRouter;
