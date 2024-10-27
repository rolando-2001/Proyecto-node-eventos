
const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    const toke= req.header('x-token');
    if(!toke){
        return res.status(401).json({
            ok:false,
            msg:'No hay token en la petición'
        })
    }

    try {
        const {uid,name}  = jwt.verify(toke,process.env.SECRET_JWT_SEED);
        req.uid=uid;
        req.name=name;
        
    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg:'Token no válido'
        })
        
    }

    next();


}

module.exports = {
    validarJWT,
}