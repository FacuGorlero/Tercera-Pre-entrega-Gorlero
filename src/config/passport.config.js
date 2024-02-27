const {configObject} = require('./index.js');
const passport = require('passport');
const jwt = require('passport-jwt');
const GitHubStrategy = require('passport-github2');
const {userService} = require('../repositories/services.js');

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const usersService = userService;
console.log(configObject)

exports.initializePassport = () => {

  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["token"];
    }
    return token;
  };

  // Configuración de la estrategia JWT para Passport
passport.use("jwt", new JWTStrategy(
  {
      jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
      secretOrKey: configObject.jwt_code,
  },
  async (jwt_payload, done) => {
      try {
          // La lógica de verificación del token va aquí
          // Puedes realizar acciones como buscar el usuario en la base de datos utilizando el payload del token
          // Por ejemplo, puedes hacer algo como: const user = await User.findById(jwt_payload.sub);

          // Si la verificación es exitosa, se pasa el usuario al siguiente middleware
          return done(null, jwt_payload);
      } catch (error) {
          return done(error);
      }
  }
));

  // Configuración de la estrategia de autenticación de GitHub
  passport.use('github', new GitHubStrategy({
    clientID: configObject.gh_client_id,
    clientSecret: configObject.gh_client_secret,
    callbackURL: 'http://localhost:8080/api/session/githubcallback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile);

      // Verificar si el usuario ya existe en la base de datos
      let user = await usersService.getUserByMail({ email: profile._json.email });

      if (!user) {
        // Si no existe, crear un nuevo usuario con información de GitHub
        let userNew = {
          first_name: profile.username,
          last_name: profile.username,
          email: profile._json.email,
          password: '123456' // Contraseña temporal, ya que GitHub no proporciona contraseñas
        };

        let result = await usersService.createUser(userNew);
        return done(null, result);
      }

      // Si el usuario existe, continuar con ese usuario
      done(null, user);

    } catch (error) {
      return done(error);
    }
  }));

  // Serializar al usuario para almacenarlo en la sesión
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserializar al usuario a partir del ID almacenado en la sesión
  passport.deserializeUser(async (id, done) => {
    let user = await userService.getUserBy({ _id: id });
    done(null, user);
  });

};
