const {messageService} = require('../repositories/services');

class MessagesController {
    constructor() {
      this.service = messageService
    };
  
    clearMessages = async (req, res) => {
      try{
        await this.service.clearMessages();
        res.sendSuccess({})
      } catch(error){
        res.sendCatchError(error)
      }
    }
  }

  module.exports = {MessagesController};