/*
    Ruta: /api/users
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getUser, createUser, deleteUser, updateUser } = require('../controllers/user');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', getUser);
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'debe de ingresar el rol : ADMIN o CLIENT').not().isEmpty(),
    validarCampos,
], createUser);

router.delete('/:id', validarJWT, deleteUser) ;

router.put('/:id', [ 
    validarJWT, 
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'debe de ingresar el rol : ADMIN o CLIENT').not().isEmpty(),
    validarCampos,
], updateUser) ;

module.exports = router;