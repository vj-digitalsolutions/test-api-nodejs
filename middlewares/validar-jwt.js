const jwt = require('jsonwebtoken');
const validarJWT = (req, res, next) =>{
    console.log('valida token');
    //leer el token
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'Debe de enviar Token' 
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRE);
        //console.log(uid);
        req.uid = uid;

    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: 'token incorrecto' 
        });
    }
    next();
}

module.exports = {
    validarJWT
}