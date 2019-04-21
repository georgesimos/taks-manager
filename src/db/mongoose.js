const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

// Defining models
const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlenght: 7,
        validate(value) {
            // if (!validator.isLength(value, { min: 6 })) {
            //     throw new Error('Password is less than 6 chars')
            // }
            // if (validator.matches(value, 'password')) {
            //     throw new Error('Password should not be named like that')
            // }
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password should not contain word: password')
            }

        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    }
})

const Task = mongoose.model('Task', {
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true

    },
    completed: {
        type: Boolean,
        default: false
    }
})

// Creating model Instances
const user = new User({ name: 'Georgios', email: 'geosimos91@gmail.com', password: 'passWord123' })
const task = new Task({ title: 'Learn Node.js', description: 'Learning node.js by watching videos on Udemy', completed: false })

// Saving the data
// user.save()
//     .then(res => console.log(res))
//     .catch(err => console.log(err.message))

task.save()
    .then(res => console.log(res))
    .catch(err => console.log(err))
