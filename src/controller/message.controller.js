const {MessageMongo} = require('../Daos-Mongo/mongo/message.daomongo');

class MessagesController {
    constructor() {
      this.service = new MessageMongo
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