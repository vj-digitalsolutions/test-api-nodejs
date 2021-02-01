const { response} = require('express');
const bcryptjs = require('bcryptjs');
const { generaJWT } = require('../helpers/jwt');

//para trabajar con firebase
const admin = require('firebase-admin');
const db = admin.firestore();
const query = db.collection("users");

const login = async (req, res = response) => {
    const {email, password } = req.body;
    try {
        //verificamos email
        const usersRegister = await query.where('email', '==', req.body.email).where('status', '==', 'A').get();
        if (usersRegister.docs.length == 0) {
            return res.status(400).json({
                ok:false,
                msg:'Email no valida'
            });
        }

        //verificamos contraseña
        const response = usersRegister.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            last_name: doc.data().lastname,
            email: doc.data().email,
            password: doc.data().password,
        }));

        //const passwdUsuario = usersRegister.doc.data()
        console.log(response[0].password);
        const validPassword = bcryptjs.compareSync(password, response[0].password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'Password no valido'
            });
        }

        //generar el token - JWT
        const datos = {
            "uid": response[0].id,
            "name": response[0].name,
            "last_name": response[0].lastname,
            "email": response[0].email
        }

        const token = await generaJWT(datos);

        res.json({
            ok:true,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        });
    }
}

module.exports = {
    login
}