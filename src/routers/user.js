const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.sendStatus(400)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', auth, async (req, res) => {
    if (!req.user.isAdmin) res.sendStatus(401)
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.sendStatus(400)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.get('/users/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) res.sendStatus(401)
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) return res.sendStatus(404)
        res.send(user)
    } catch (e) {
        res.sendStatus(400)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstname', 'lastname', 'username', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' })

    try {
        const { user } = req
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/users/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) res.sendStatus(401)
    const _id = req.params.id

    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstname', 'lastname', 'username', 'email', 'password', 'isAdmin']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' })

    try {
        const user = await User.findById(_id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        if (!user) return res.sendStatus(404)
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    if (req.user.isAdmin) res.sendStatus(401)
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.sendStatus(400)
    }
})


router.delete('/users/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) res.sendStatus(401)
    const _id = req.params.id

    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) return res.sendStatus(404)

        res.send(user)
    } catch (e) {
        res.sendStatus(400)
    }
})


module.exports = router