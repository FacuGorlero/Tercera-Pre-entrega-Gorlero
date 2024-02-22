const {Router} = require ('express');
const {MessagesController} = require ('../controller/message.controller')

const router = Router()
const Control = new MessagesController()

router.delete('/', Control.clearMessages)

exports.MessageRouter = router;