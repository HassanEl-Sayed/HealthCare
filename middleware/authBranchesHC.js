const jwt = require('jsonwebtoken')
const BranchesHC = require('../models/BranchesHC');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRETBRANCHESHC)
        const branchesHC = await BranchesHC.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!branchesHC) {
            throw new Error()
        }
        req.token = token
        req.branchesHC = branchesHC
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth