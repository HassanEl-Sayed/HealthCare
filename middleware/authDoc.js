const jwt = require('jsonwebtoken')
const Doctor = require('../models/Doctor')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRETDOCTOR)
        const doctor = await Doctor.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!doctor) {
            throw new Error()
        }
            req.token = token
            req.doctor = doctor
        
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth