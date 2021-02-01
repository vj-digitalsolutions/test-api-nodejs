const { response } = require('express');
const dateFormat = require('dateformat');
const admin = require('firebase-admin');

const db = admin.firestore();
const query = db.collection("rooms");


const getRooms = async(req, res) => {
    try {
        const querySnapshot = await query.get() ;
        let docs = querySnapshot.docs;

        const response = docs.map((doc) => ({
            id: doc.id,
            room_number: doc.data().room_number,
            room_type: doc.data().room_type,
            status: doc.data().status,
        }))

        res.json({
            status: true,
            habitaciones: response
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado .. revisar logs'
        });
    }
}

const createRoom = async (req, res = response) => {
    try { 
        if(req.body.room_type.toUpperCase() != "SIMPLE" && req.body.room_type.toUpperCase() != "DOBLE"){
            return res.status(400).json({
                ok:false,
                msg: 'El tipo de habitación es incorrecto, solo puede ser Simple o Doble'
            });
        }

        if(req.body.status != "A" && req.body.status != "I"){
            return res.status(400).json({
                ok:false,
                msg: 'El estado de habitación es incorrecto, solo puede ser A -> Activo o I -> Inactivo'
            });
        }

        const roomRegister = await query.where('room_number', '==', req.body.room_number).get();
        if (roomRegister.docs.length > 0) {
            return res.status(400).json({
                ok:false,
                msg: 'La habitación ya ha sido registrada'
            });
        }

        const day = dateFormat(new Date(), "yyyymmddhhMMss");

        query.doc('/' + day + '/')
              .create({
                    room_number: req.body.room_number, 
                    room_type: req.body.room_type.toUpperCase() , 
                    status: req.body.status.toUpperCase()
                });

        res.json({
            status: true,
            msg: 'se creo habitación'
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            msg: 'no se creo habitación'
        });
    }
}

const deleteRoom = async (req, res = response) => {
    try {
        const uid = req.params.id;

        //verificamos que exista el id
        const roomRegister = await query.doc(uid).get();
        console.log(roomRegister.exists);
        if (!roomRegister.exists) {
            return res.status(400).json({
                ok:false,
                msg: 'no existe el id de la habitación'
            });
        }

        const result = await query.doc(uid).update({
            status: 'I',
        });

        res.json({
            status: true,
            msg: 'se elimino habitación'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'se produjo un error'
        });
    }
}


const updateRoom = async (req, res = response) => {
    try {
        const uid = req.params.id;

        //verificamos que exista el id
        const roomExist = await query.doc(uid).get();
        console.log(roomExist.exists);
        if (!roomExist.exists) {
            return res.status(400).json({
                ok:false,
                msg: 'no existe el id de la habitación'
            });
        }

        if(req.body.status != "A" && req.body.status != "I"){
            return res.status(400).json({
                ok:false,
                msg: 'El estado de habitación es incorrecto, solo puede ser A -> Activo o I -> Inactivo'
            });
        }

        const roomRegister = await query.where('room_number', '==', req.body.room_number).get();
        if (roomRegister.docs.length > 0) {
            return res.status(400).json({
                ok:false,
                msg: 'La habitación ya ha sido registrada'
            });
        }

        const result = await query.doc(uid).update({
            room_number: req.body.room_number, 
            room_type: req.body.room_type.toUpperCase() , 
            status: req.body.status.toUpperCase()
        });

        res.json({
            status: true,
            msg: 'se actualizo habitación'
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
    getRooms,
    createRoom,
    deleteRoom,
    updateRoom
}