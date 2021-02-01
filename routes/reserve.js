/*
    Ruta: /api/reserve
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { createReserve, getReserve, deleteReserve } = require('../controllers/reserve');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    check('fec_ini', 'debe de ingresar el tipo de habitacion : simple o doble').not().isEmpty(),
    check('fec_fin', 'debe de ingresar el tipo de habitacion : simple o doble').not().isEmpty(),
    validarCampos,
], getReserve);

router.post('/', [
    validarJWT,
    check('room_number', 'El numero de habitacion es obligatorio').not().isEmpty(),
    check('fec_ini', 'debe de ingresar el tipo de habitacion : simple o doble').not().isEmpty(),
    check('fec_fin', 'debe de ingresar el tipo de habitacion : simple o doble').not().isEmpty(),
    check('fec_res', 'debe de ingresar el tipo de habitacion : simple o doble').not().isEmpty(),
    check('cliente', 'El estado de habitacion es obligatorio').not().isEmpty(),
    check('nro_doc', 'El número de documeto es obligatorio').not().isEmpty(),
    validarCampos,
], createReserve);


router.delete('/:id', validarJWT, deleteReserve) ;

module.exports = router;