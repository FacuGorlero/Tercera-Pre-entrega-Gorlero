const {configObject} = require ('./config/index.js');
const express = require('express');
const { createServer} = require('node:http');
const serverIo = require('./routes/serverIO.js');
//const session = require('express-session');
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars');

const {AppRouter} = require('./routes/index.js');

const {program} = require('./config/commander.js');
const passport = require('passport');
const {initializePassport} = require('./config/passport.config.js');


const {mode} = program.opts();
console.log('Mode config: ' + mode);


configObject.connectDB()

const port = process.env.PORT ;
const app = express();
const server = createServer(app)
serverIo(server)


// middlewars de passport
initializePassport()
app.use(passport.initialize())
// app.use(passport.session())


app.use(AppRouter)

// configuraciones de la App
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser(configObject.cookies_code))

// motor de plantilla
app.engine('hbs', handlebars.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


// Confirmacion de inicio
server.listen(port, () => {
  console.log(`Server andando en port ${port}`);
});

