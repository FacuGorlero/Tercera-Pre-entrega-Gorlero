const { Router } = require('express')
const { viewsrouter } = require('./views.route.js');
const { productsrouter } = require('./products.route.js');
const {sessionrouter } = require('./session.route.js');
const { cartsRouter } = require('./cart.route.js');
const {handleResponses} = require("../middleware/handleresponses.js");
const {MessageRouter} = require('./message.route.js');


const router = Router()

// definiendo vistas
router.use('/', viewsrouter);

// FIXME: arreglar este delete
// definiendo la API
router.use('/api/products/', handleResponses,productsrouter);
router.use('/api/carts/', handleResponses,cartsRouter);
router.use('/api/session', handleResponses, sessionrouter);
router.use('/api/users', () => {})
router.use('/api/messages', handleResponses, MessageRouter);

router.use('*', (req, res) => res.status(404).send('Not Found'))
router.use((err, req, res, next) => res.status(500).json({message: "Error Server", err}))

exports.AppRouter = router