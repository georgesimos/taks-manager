const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
})

// Defining models
const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

const Task = mongoose.model('Task', {
    title: {
        type: String
    },
    description: {
        type: String
    },
    completed: {
        type: Boolean
    }
})

// Creating model Instances
const user = new User({ name: 'Geo', age: 28 })
const task = new Task({ title: 'Learn Node.js', description: 'Learning node.js by watching videos on Udemy', completed: false })

// Saving the data
// user.save()
//     .then(res => console.log(res))
//     .catch(err => console.log(err))

task.save()
    .then(res => console.log(res))
    .catch(err => console.log(err))
