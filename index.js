const express = require('express');
//para leer archivos .env
require('dotenv').config();
//para que pueda acceder desde cualquier lado
const cors = require('cors');

/*//para trabajar con firebase
const admin = require('firebase-admin');
const serviceAccount = require("./api-test-6e8d4-firebase-adminsdk-5zoh3-39338f66d9.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.URLFIREBASE
});

const admin = admin.database();
*/


//creamos el servidor
const app = express();
app.use(cors());

//lectura del body y parseo
app.use(express.json());

//Rutas
app.use('/api/users', require('./routes/user'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/rooms', require('./routes/room'));
app.use('/api/reserve', require('./routes/reserve'));


app.listen(process.env.PORT, () => {
    console.log('Servidor Corriendo')
});