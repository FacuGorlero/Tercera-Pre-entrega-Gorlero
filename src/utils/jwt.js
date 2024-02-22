// Importa el módulo JWT necesario para trabajar con tokens.
const jwt = require('jsonwebtoken')
const {configObject} = require('../config/index')
// Establece una clave privada para firmar y verificar los tokens JWT.
const JWT_PRIVATE_KEY = configObject.jwt_code;

// Función para crear un token JWT.
// Toma un objeto de usuario y genera un token JWT firmado con la clave privada.
// El token expirará en 1 día ('1d').
const createToken = (user) => jwt.sign(user, JWT_PRIVATE_KEY, { expiresIn: '1d' })


module.exports = {
    createToken,
}
