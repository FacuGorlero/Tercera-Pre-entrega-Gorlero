class UserRepository {
    constructor(dao){
        this.dao = dao
    }
    getUsersPaginate = async (limit=10, page=1) => await this.dao.getUsersPaginate({}, {limit, page, lean: true})
    getUsers = async() => await this.dao.get()
    getUserBy = async(filter) => await this.dao.getBy(filter)
    getUserById = async (uid) => await this.model.getById({_id: uid})
    getUserByMail = async (uemail) => await this.model.getByMail({email: uemail})
    createUser = async(newUser) => await this.dao.create(newUser)
    updateUser = async(uid, userUpdate) => await this.dao.update(uid, userUpdate)
    deleteUser = async (uid) => await this.model.delete({_id: uid})
}

module.exports = UserRepository