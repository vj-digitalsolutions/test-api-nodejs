/*
    Ruta: /api/rooms
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { getRooms, createRoom, deleteRoom, updateRoom } = require('../controllers/room');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getRooms);

router.post('/', [
    validarJWT,
    check('room_number', 'El numero de habitacion es obligatorio').not().isEmpty(),
    check('room_type', 'debe de ingresar el tipo de habitacion : simple o doble').not().isEmpty(),
    check('status', 'El estado de habitacion es obligatorio').not().isEmpty(),
    validarCampos,
], createRoom);

router.delete('/:id', validarJWT, deleteRoom) ;

router.put('/:id', [ 
    validarJWT, 
    check('room_number', 'El numero de habitacion es obligatorio').not().isEmpty(),
    check('room_type', 'debe de ingresar el tipo de habitacion : simple o doble').not().isEmpty(),
    check('status', 'El estado de habitacion es obligatorio').not().isEmpty(),
    validarCampos,
], updateRoom) ;


module.exports = router;