const { Schema, model } = require('mongoose')
const mongososePaginate = require('mongoose-paginate-v2');


const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    atCreated: {
        type: Date,
        default: Date()
    },
    password: {
        type: String,
        required:true    
    },
    birthday: {
        type: Date
      },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
      }
})

userSchema.pre('find', function () {
    this.populate('cart');
  });
  
  userSchema.plugin(mongososePaginate)

const userModel = model('users', userSchema)

module.exports = {
    userModel
}