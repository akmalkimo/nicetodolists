const mongoose = require('mongoose')

const noteSchema = mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'please provide the note text']
        },

        id: {
            type: Number,
            required: [true, 'please provide the note id']
        },

        checked: {
            type: Boolean,
            required: [true, "please provide the note's status"]
        },

        indexPass: {
            type: String,
            required: [true, 'please provide the index pass']
        }
    },
    {
        timestamps: true
    }
)

const Note = mongoose.model("Note", noteSchema)

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'please provide the email'],
            unique: true
        },

        password: {
            type: String,
            required: [true, 'please provide the password']
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema)

module.exports = {Note, User}