const jwt = require('jsonwebtoken');

const generaJWT = (uid) =>{

    return new Promise((resolve, reject) => {
        const paylog = {
            uid
        }
    
        jwt.sign( paylog, process.env.JWT_SECRE, {
            expiresIn: '12h'
        }, (err, token) =>{
            if(err){
                console.log(err);
                reject('No se pudo generar el JWT');
            }else{
                resolve( token)
            }
        });
    });
    
}

module.exports = {
    generaJWT
}