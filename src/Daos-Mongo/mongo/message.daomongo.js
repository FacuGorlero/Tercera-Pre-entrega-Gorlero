const { messageModel } = require('./Models/messages.model.js');

class MessageDaoMongo {
  constructor (){
    this.model = messageModel
  }

  add = async (newMessage) => {
    await this.model.create(newMessage)
    return await this.getMessages()
  }

  get = async () => await this.model.find({})

  clear = async() => await this.model.deleteMany({})
}
// Exporta el DAO para su uso en otros archivos
exports.MessageMongo = MessageDaoMongo;