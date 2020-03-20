const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
        type: String,
        /*unique: true,*/
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true
    },
    hash: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        /*unique: true,*/
        required: [true, "can't be blank"],
        /*match: [/\S+@\S+\.\S+/, 'is invalid'],*/
        index: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'user'
    }
})

userSchema.set('toJSON', { virtuals: true})

module.exports = mongoose.model('User', userSchema)
