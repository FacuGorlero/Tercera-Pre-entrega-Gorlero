const dotenv = require('dotenv')
const {program} = require('./commander.js')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const {connect} = require ('mongoose')


const opts = program.opts();

dotenv.config()

const configObject = {
    
    port: process.env.PORT ,
    jwt_code: process.env.JWT_SECRET_CODE,
    cookies_code: process.env.COOKIES_SECRET_CODE,
    mongo_url: process.env.MONGO_URL,
    mongo_secret_code: process.env.MONGO_SECRET_CODE,
    uadmin: process.env.USER_ADMIN,
    uadmin_pass: process.env.USER_ADMIN_PASS,
    gh_client_id: process.env.GITHUB_CLIENT_ID,
    gh_client_secret: process.env.GITHUB_CLIENT_SECRET,
    development: opts.mode == 'development',
    persistence: process.env.PERSISTENCE,

    connectDB: async () => {
        MongoSingleton.getInstance();
    },
    sessionAtlas: (app) => {
        app.use(
            session({
            store: MongoStore.create({
                mongoUrl: process.env.MONGO_URL, // 
                mongoOptions: {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
              },
                ttl: 15000000000,
            }),
            secret: process.env.MONGO_SECRET_CODE,
            resave: true, 
            saveUninitialized: true
          }))
    },
    
}
class MongoSingleton {
    static instance //
    constructor() {
      connect(process.env.MONGO_URL);
    }
  
    static getInstance() {
      if(!this.instance){
        console.log('Conectado a Base de Datos');
        return this.instance = new MongoSingleton();
      }
      console.log('Base de Datos ya conectada');
      return this.instance;
    }
  }

module.exports = {configObject, MongoSingleton}
