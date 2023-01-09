const jwt = require('jsonwebtoken')
const Lab = require('../models/Lab')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRETLAB)
        const lab = await Lab.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!lab) {
            throw new Error()
        }
        req.token = token
        req.lab = lab
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth