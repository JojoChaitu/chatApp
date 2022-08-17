const jwt = require('jsonwebtoken')

const auth = (req,res,next) => {

    const token = req.cookies.jwt
    // console.log(token);
    if(!token){
        return res.status(401).send("you should login first to get access")
    }
    try {
        const payload = jwt.verify(token,'secret')

        req.user = { userId:payload.userId,name:payload.name }
        next()
    } catch (error) {
        res.status(401).json({error:'Unauthorized access'})
    }
}

module.exports = auth
