const { response } = require('express');
//para trabajar con firebase
const admin = require('firebase-admin');
const bcryptjs = require('bcryptjs');
const dateFormat = require('dateformat');

const serviceAccount = require("../api-test-6e8d4-firebase-adminsdk-5zoh3-39338f66d9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.URLFIREBASE
});

const db = admin.firestore();
const query = db.collection("users");

const getUser = async(req, res) => {
    try {
        
        const querySnapshot = await query.get() ;
        let docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            last_name: doc.data().lastname,
            email: doc.data().email,
            password: doc.data().password,
            status: doc.data().status,
        }))

        res.json({
            status: true,
            usuarios: response
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'se produjo un error'
        });
    }
}

const createUser = async(req, res = response) => {
    try {

        if(req.body.role.toUpperCase() != "ADMIN" && req.body.role.toUpperCase() != "CLIENT"){
            return res.status(400).json({
                ok:false,
                msg: 'el rol no es permitido'
            });
        }

        if(req.body.role.toUpperCase() === "ADMIN" && (req.body.password =="" || req.body.password == null  )){
            return res.status(400).json({
                ok:false,
                msg: 'es obligatorio enviar password'
            });
        }

        const usersRegister = await query.where('email', '==', req.body.email).get();
        if (usersRegister.docs.length > 0) {
            return res.status(400).json({
                ok:false,
                msg: 'el email ya ha sido registrado'
            });
        }

        const day = dateFormat(new Date(), "yyyymmddhhMMss");
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        const clave = (req.body.role.toUpperCase() === "ADMIN") ? bcryptjs.hashSync(req.body.password, salt) : "";

        query.doc('/' + day + '/')
              .create({
                    name: req.body.name, 
                    lastname: req.body.lastname, 
                    email: req.body.email, 
                    password: clave,
                    role: req.body.role.toUpperCase() ,
                    status: 'A'
                });

        res.json({
            status: true,
            msg: 'se creo usuario'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'se produjo un error'
        });
    }
}

const deleteUser = async (req, res = response) => {
    try {
        console.log("borra usuario");
        const uid = req.params.id;

        //verificamos que exista el id
        const usersRegister = await query.doc(uid).get();
        console.log(usersRegister.exists);
        if (!usersRegister.exists) {
            return res.status(400).json({
                ok:false,
                msg: 'no existe el id'
            });
        }

        const result = await query.doc(uid).delete();
        console.log(result);
        
        res.json({
            status: true,
            msg: 'se elimino usuario'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'se produjo un error'
        });
    }
    
}

const updateUser = async (req, res = response) => {
    try {
        const uid = req.params.id;

        //verificamos que exista el id
        const usersRegister = await query.doc(uid).get();
        console.log(usersRegister.exists);
        if (!usersRegister.exists) {
            return res.status(400).json({
                ok:false,
                msg: 'no existe el id'
            });
        }

        //verificamos que el email sea único
        const emailExist = await query.where('email', '==', req.body.email).get();
        console.log("email exite:" +emailExist)
        if (emailExist.docs.length > 0) {
            return res.status(400).json({
                ok:false,
                msg: 'No puede usar el email, ya se encuentra registrado'
            });
        }

        if(req.body.role.toUpperCase() === "ADMIN" && (req.body.password =="" || req.body.password == null  )){
            return res.status(400).json({
                ok:false,
                msg: 'es obligatorio enviar password'
            });
        }

        const day = dateFormat(new Date(), "yyyymmddhhMMss");
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        const clave = (req.body.role.toUpperCase() === "ADMIN") ? bcryptjs.hashSync(req.body.password, salt) : "";

        const result = await query.doc(uid).update({
            name: req.body.name, 
            lastname: req.body.lastname, 
            email: req.body.email, 
            password: clave,
            role: req.body.role.toUpperCase() ,
        });

        res.json({
            status: true,
            msg: 'se actualizo usuario'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'se produjo un error'
        });
    }
}
module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser
}