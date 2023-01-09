const jwt = require('jsonwebtoken')
const BranchesXL = require('../models/XLBranches');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRETBRANCHESXL)
        const branchesXL = await BranchesXL.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!branchesXL) {
            throw new Error()
        }
        req.token = token
        req.branchesXL = branchesXL
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth