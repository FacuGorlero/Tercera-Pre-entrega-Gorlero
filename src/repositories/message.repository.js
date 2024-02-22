class MessageRepository {
    constructor(dao){
        this.dao = dao
    }

    getMessages = async() => await this.dao.get()
    addMessage = async(newMessage) => await this.dao.add(newMessage)
    clearMessages = async() => await this.dao.clear()

}

module.exports = MessageRepository