const jwt = require('jsonwebtoken');
const validateToken = (req,res,next) =>{
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader){
        token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoder )=> {
            if(err){
                res.status(401);
                throw new Error('token expired');
            }

            const user = decoder.user;
            const token = jwt.sign({
                user
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:'10 m'
            }
            );

            req.user = user;
            req.token = token;
            next();
        })
    }

    if(!token){
        res.status(401);
        throw new Error('Invaid token');
    }

}

module.exports = validateToken;