const jwt = require('jsonwebtoken')
const XRay = require('../models/XRay')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRETXRAY)
        const xray = await XRay.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!xray) {
            throw new Error()
        }
        req.token = token
        req.xray = xray
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth