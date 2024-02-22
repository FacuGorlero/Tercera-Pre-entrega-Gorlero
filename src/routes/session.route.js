// Importación de módulos y configuración inicial
const { Router } = require('express');
const passport = require('passport');
const {handleResponses} = require("../middleware/handleresponses.js");
const {handleAuthFront} = require('../middleware/handlepolicies.js'); 
const SessionsController = require('../controller/session.controller.js');


const router = Router();
const Control = new SessionsController();

// http://localhost:PORT/api/sessions/
router.post('/register', Control.register);
router.post('/login', Control.login);
router.post('/loginSession', Control.loginSession);
router.get ('/logout', Control.logout);

// GITHUB API
router.get('/github', passport.authenticate('github', {scope:['user:email']}), Control.github)
router.get('/githubcallback', passport.authenticate('github', {session: false, failureRedirect: '/'}), Control.githubcallback)

// TODO Pruebas
router.get('/current', handleAuthFront(['USER']), Control.pruebasCurrent)

exports.sessionrouter = router;
