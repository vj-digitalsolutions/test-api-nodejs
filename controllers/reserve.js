const { response } = require('express');
const dateFormat = require('dateformat');
const admin = require('firebase-admin');

const db = admin.firestore();
const query = db.collection("reserves");
const queryRoom = db.collection("rooms");

const getReserve = async(req, res = response) => {
    try {
        
        const numRegister = await queryRoom.where('status', '==', 'A').get();
        let numHabitaciones = numRegister.docs.length;
        let numHabitacionesOcup = 0;

        const arrayReserva = [];
        await query.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if((doc.data().fec_ini >= req.body.fec_ini) && (doc.data().fec_fin <= req.body.fec_fin)){
                    const obj = {
                        id: doc.id,
                        number_room: doc.data().number_room, 
                        fec_ini: doc.data().ini, 
                        fec_fin: doc.data().fec_fin,
                        fec_res: doc.data().fec_res,
                        cliente: doc.data().cliente,
                        nro_doc: doc.data().nro_doc, 
                    }
                    arrayReserva.push(obj);
                    numHabitacionesOcup++;
                }
            });
        });

        //console.log(arrayReserva);
        res.json({
            status: true,
            libres: numHabitaciones-numHabitacionesOcup,
            reservas: arrayReserva
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            msg: 'se produjo un error'
        });
    }
}

const createReserve = async (req, res = response) => {
    try { 
        const roomRegister = await queryRoom.where('room_number', '==', req.body.room_number).where('status', '==', 'A').get();
        if (roomRegister.docs.length == 0) {
            return res.status(400).json({
                ok:false,
                msg: 'No existe habitacion'
            });
        }

        const arrayReserva = [];
        let existeRoom = 0;
        await query.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if((doc.data().fec_ini >= req.body.fec_ini) && (doc.data().fec_fin <= req.body.fec_ini)){
                    if(doc.data().number_room == req.body.room_number){
                        existeRoom++;
                    }
                }
            });
        });
    console.log(existeRoom);
    if(existeRoom>0){
        return res.status(400).json({
            ok:false,
            msg: 'No se puede realizar reserva de la habitacion, verifique disponibilidad'
        });
    }
        /*const existReserve = await query.where('room_number', '==', req.body.room_number).where('fec_ini', '==', 'A').get();
        if (roomRegister.docs.length == 0) {
            return res.status(400).json({
                ok:false,
                msg: 'No existe habitacion'
            });
        }*/

        const day = dateFormat(new Date(), "yyyymmddhhMMss");

        query.doc('/' + day + '/')
              .create({
                    number_room: req.body.room_number, 
                    fec_ini: req.body.fec_ini, 
                    fec_fin: req.body.fec_fin,
                    fec_res: req.body.fec_res,
                    cliente: req.body.cliente,
                    nro_doc: req.body.nro_doc,
                });

        res.json({
            status: true,
            msg: 'se creo reseva'
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            msg: 'no se creo reseva'
        });
    }
}

const deleteReserve = async (req, res = response) => {
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

        const result = await query.doc(uid).delete();
        console.log(result);
        
        res.json({
            status: true,
            msg: 'se elimino reserva'
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
    createReserve,
    getReserve,
    deleteReserve
}